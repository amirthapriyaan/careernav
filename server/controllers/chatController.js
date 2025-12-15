const Groq = require("groq-sdk");
const Conversation = require("../models/Conversation");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function askCareerQuestion(req, res) {
  try {
    const { message, conversationId, userId = "guest" } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message required" });
    }

    const completion = await groq.chat.completions.create({
      model: "moonshotai/kimi-k2-instruct-0905",
      messages: [
        {
          role: "system",
          content:
            "You are an AI Career Advisor. Use clear sections like Skills, Gaps, Advice when appropriate.",
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 900,
    });

    const answer =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    // 🔹 Save to MongoDB (NON-BREAKING)
    let conversation = conversationId
      ? await Conversation.findById(conversationId)
      : null;

    if (!conversation) {
      conversation = await Conversation.create({
        userId,
        title: message.slice(0, 40),
        messages: [],
      });
    }

    conversation.messages.push(
      { role: "user", content: message },
      { role: "bot", content: answer }
    );

    await conversation.save();

    res.json({
      answer,
      conversationId: conversation._id,
    });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "AI failed" });
  }
}

module.exports = { askCareerQuestion };
