
const maybeExtract = require("../utils/extractSkills");

// normalize extractSkills
const extractSkills =
  typeof maybeExtract === "function"
    ? maybeExtract
    : maybeExtract.extractSkills || (() => ({ skillsFound: [] }));

function computeKeywordMatchScore(jdText, resumeText, keywords) {
  const jd = (jdText || "").toLowerCase();
  const required = keywords.filter((k) => jd.includes(k.toLowerCase()));
  if (required.length === 0) return { required, matched: [], pct: 0 };

  const resume = (resumeText || "").toLowerCase();
  const matched = required.filter((k) => resume.includes(k.toLowerCase()));
  const pct = Math.round((matched.length / required.length) * 100);
  return { required, matched, pct };
}

function hasSkillsSection(resumeText) {
  const t = (resumeText || "").toLowerCase();
  return /\bskills\b/.test(t) || /\btechnical skills\b/.test(t);
}

function lengthScore(resumeText) {
  const words = (resumeText || "").trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 0;
  if (words < 100) return 40;
  if (words <= 800) return 100;
  return 70;
}

exports.atsHint = async (req, res) => {
  try {
    console.log("atsHint called, body lengths:", {
      jd: (req.body.jobDescription || "").length,
      resume: (req.body.resumeText || "").length,
    });

    const { jobDescription = "", resumeText = "" } = req.body || {};
    if (!jobDescription || !resumeText) {
      return res.status(400).json({ error: "jobDescription and resumeText are required" });
    }

    const ext = extractSkills(jobDescription);
    const jdSkills = Array.isArray(ext) ? ext : (ext.skillsFound || ext.skills || []);
    const fallbackKeywords = ["javascript","python","java","react","node","aws","docker","sql","mongodb"];
    const keywords = jdSkills.length ? jdSkills : fallbackKeywords;

    const { required, matched, pct } = computeKeywordMatchScore(jobDescription, resumeText, keywords);
    const skillsSection = hasSkillsSection(resumeText);
    const lenScore = lengthScore(resumeText);

    const finalScore = Math.round((pct * 0.6) + (skillsSection ? 100 * 0.2 : 50 * 0.2) + (lenScore * 0.2));

    const suggestions = [];
    if (!skillsSection) {
      suggestions.push("Add a clear 'Skills' section near the top with comma-separated keywords (e.g., React, Node, AWS).");
    } else {
      suggestions.push("Ensure your 'Skills' section includes exact keywords from the job (e.g., Docker, AWS) where applicable.");
    }

    if (pct < 50) {
      const missing = required.filter(k => !matched.includes(k));
      const topMissing = missing.slice(0, 3);
      suggestions.push(
        topMissing.length
          ? `Include keywords: ${topMissing.join(", ")} in your skills or project bullets.`
          : "Consider adding more role-specific keywords from the job description."
      );
    } else {
      suggestions.push("Good keyword coverage — emphasize your top matching projects and quantify achievements.");
    }

    const resp = {
      atsScore: finalScore,
      keywordMatchPct: pct,
      requiredKeywords: required,
      matchedKeywords: matched,
      skillsSection,
      lengthScore: lenScore,
      suggestions,
    };

    console.log("atsHint response:", resp);
    return res.json(resp);
  } catch (err) {
    console.error("atsHint error:", err);
    return res.status(500).json({ error: "Failed to compute ATS hint" });
  }
};
