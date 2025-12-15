const axios = require("axios");

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("❌ GROQ_API_KEY missing in environment variables");
}

async function callLLM(prompt) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
}

module.exports = { callLLM };
