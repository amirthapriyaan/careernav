const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

/**
 * POST /api/chat/answer
 * body: { message: string }
 */
async function chatAnswer(req, res) {
  try {
    const message = (req.body?.message || "").trim();
    if (!message) {
      return res.status(400).json({ error: "message required" });
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `
You are an AI Career Advisor.
- Answer like ChatGPT
- If a role/skill is asked:
  1. Short description
  2. Required skills
  3. Learning resources with links
- Be clear and structured.
          `,
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 800,
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "I couldn't generate an answer.";

    res.json({ answer });
  } catch (err) {
    console.error("chatAnswer error:", err.message);
    res.status(500).json({ error: "AI failed" });
  }
}

module.exports = {
  chatAnswer,
};
