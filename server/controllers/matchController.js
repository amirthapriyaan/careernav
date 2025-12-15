

const maybeExtract = require("../utils/extractSkills");
const maybeComputeScore = require("../utils/computeScore");

// normalize extractSkills
const extractSkills =
  typeof maybeExtract === "function"
    ? maybeExtract
    : maybeExtract.extractSkills || (() => ({ skillsFound: [] }));

// normalize computeScore
const computeScore =
  typeof maybeComputeScore === "function"
    ? maybeComputeScore
    : maybeComputeScore.computeScore || (() => ({
        score: 0,
        level: "Weak Match",
        matchedSkills: [],
        missingSkills: [],
      }));

// POST /api/match/analyze
async function analyze(req, res) {
  try {
    const { jobDescription = "", resumeText = "" } = req.body || {};

    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: "jobDescription and resumeText are required" });
    }

    console.log("🔍 JD length:", jobDescription.length);
    console.log("🔍 Resume length:", resumeText.length);

    const jdRes = extractSkills(jobDescription);
    const resumeRes = extractSkills(resumeText);

    const jdSkills = Array.isArray(jdRes) ? jdRes : (jdRes.skillsFound || jdRes.skills || []);
    const resumeSkills = Array.isArray(resumeRes) ? resumeRes : (resumeRes.skillsFound || resumeRes.skills || []);

    console.log("✅ JD skills:", jdSkills);
    console.log("✅ Resume skills:", resumeSkills);

    const { score, level, matchedSkills, missingSkills } = computeScore(jdSkills, resumeSkills);

    const explanation = `You match ${matchedSkills.length} out of ${jdSkills.length || 1} key skills from the job description. Overall, this is a ${level.toLowerCase()} for this role.`;

    let tip;
    if (missingSkills.length > 0) {
      tip = `Consider learning or highlighting experience with "${missingSkills[0]}", as it is important for this role.`;
    } else if (matchedSkills.length > 0) {
      tip = `Highlight your strongest skills like "${matchedSkills[0]}" prominently in your resume summary or projects section.`;
    } else {
      tip = "Add more technical skills and relevant projects to your resume to align better with the job description.";
    }

    return res.json({
      score,
      level,
      matchedSkills,
      missingSkills,
      explanation,
      tip,
    });
  } catch (err) {
    console.error("❌ analyze error:", err);
    return res.status(500).json({ error: "Failed to analyze match" });
  }
}

// POST /api/match/interview-questions
async function interviewQuestions(req, res) {
  try {
    
    const { jobDescription = "", resumeText = "" } = req.body || {};

    
    const jdRes = extractSkills(jobDescription);
    const jdSkills = Array.isArray(jdRes) ? jdRes : (jdRes.skillsFound || jdRes.skills || []);

    const questions = [];

    if (jdSkills.length) {
      for (let i = 0; i < Math.min(6, jdSkills.length); i++) {
        const s = jdSkills[i];
        questions.push({
          question: `Explain a project where you used ${s}. What was your role and the impact?`,
          answer: `Briefly describe a project where you used ${s}, your responsibilities, technologies used, and a measurable outcome (e.g., improved performance by X%).`,
        });
      }
    }

 
    if (questions.length === 0) {
      questions.push(
        { question: "Tell me about a technical project you built.", answer: "Describe the project, your role, technologies used, and results." },
        { question: "Explain how you debug a production issue.", answer: "Outline steps: reproduce, logs, isolate cause, fix, test, and deploy with rollback plan." }
      );
    }

    return res.json({ questions });
  } catch (err) {
    console.error("❌ interviewQuestions error:", err);
    return res.status(500).json({ error: "Failed to generate interview questions" });
  }
}



// server/controllers/matchController.js
const OpenAI = (() => {
  try {
   
    return require('openai');
  } catch (e) {
    return null;
  }
})();


function heuristicAnalyze(jobDescription) {
  const text = (jobDescription || '').toLowerCase();

  
  const skillBuckets = {
    must: [
      'react', 'node', 'javascript', 'java', 'python', 'c++', 'c', 'sql', 'mongodb',
      'aws', 'docker', 'kubernetes', 'git', 'html', 'css', 'spring', 'express', 'typescript'
    ],
    good: [
      'graphql', 'redis', 'kafka', 'terraform', 'ansible', 'gcp', 'azure', 'jest', 'cypress', 'webpack', 'linux'
    ]
  };

  const mustHave = [];
  const goodToHave = [];

  for (const s of skillBuckets.must) {
    if (text.includes(s)) mustHave.push(s);
  }
  for (const s of skillBuckets.good) {
    if (text.includes(s)) goodToHave.push(s);
  }


  if (mustHave.length === 0) {
    const words = text.match(/\b[a-z\+\#\.\-]{3,}\b/g) || [];
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const top = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,6).map(x=>x[0]);
    // filter some stopwords
    const stop = new Set(['the','and','for','with','that','will','you','your','our','from','have']);
    for (const t of top) if (!stop.has(t) && t.length <= 20) mustHave.push(t);
  }

  const sents = jobDescription.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sents.slice(0, 3).join(' ').slice(0, 500);

  return { mustHave, goodToHave, summary };
}

/**
 * analyzeJDHandler
 * POST /api/match/analyze-jd
 * Body: { jobDescription }
 */
async function analyzeJDHandler(req, res) {
  try {
    const { jobDescription = '' } = req.body || {};
    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ error: 'jobDescription required (min length)' });
    }

    // If OpenAI SDK available and env var present -> call LLM
    if (OpenAI && process.env.OPENAI_API_KEY) {
      try {
        // instantiate client
        const client = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        // Compose prompt carefully to request JSON
        const prompt = `
Extract the must-have skills, good-to-have skills, and a 3-line summary from this job description.
Return ONLY valid JSON in this exact format:
{"mustHave":["skill1","skill2"], "goodToHave":["skillA"], "summary":"three-line summary text"}
Job description:
"""${jobDescription}"""
        `.trim();

        // Use a minimal completions or chat call depending on SDK availability
        // We'll use "chat.completions" where available for modern SDKs
        const response = await client.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.0,
          max_tokens: 400,
        });

        const output = (response?.choices?.[0]?.message?.content || '').trim();

        // Try to parse JSON from the output (safe)
        let parsed;
        try {
          parsed = JSON.parse(output);
        } catch (err) {
          // if LLM returns extra text, try to extract JSON substring
          const jsonMatch = output.match(/\{[\s\S]*\}/);
          if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        }

        if (parsed) {
          // make sure arrays exist
          parsed.mustHave = Array.isArray(parsed.mustHave) ? parsed.mustHave : (parsed.mustHave ? [String(parsed.mustHave)] : []);
          parsed.goodToHave = Array.isArray(parsed.goodToHave) ? parsed.goodToHave : (parsed.goodToHave ? [String(parsed.goodToHave)] : []);
          parsed.summary = String(parsed.summary || '').trim();
          return res.json(parsed);
        } else {
          // fallback to heuristic
          const fallback = heuristicAnalyze(jobDescription);
          return res.json({ ...fallback, note: 'fallback-heuristic' });
        }
      } catch (errLLM) {
        console.warn('LLM analyze-jd failed, falling back:', errLLM && errLLM.message || errLLM);
        const heuristic = heuristicAnalyze(jobDescription);
        return res.json({ ...heuristic, note: 'fallback-heuristic-due-to-llm-error' });
      }
    }

    // No LLM available -> use heuristic extractor
    const heuristic = heuristicAnalyze(jobDescription);
    return res.json({ ...heuristic, note: 'heuristic-only' });
  } catch (err) {
    console.error('analyze-jd error', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Server error' });
  }
}




module.exports = { analyze, interviewQuestions,analyzeJDHandler  };
