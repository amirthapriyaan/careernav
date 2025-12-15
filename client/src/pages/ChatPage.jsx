import React, { useState, useRef, useEffect } from "react";
import { askCareerQuestion } from "../services/api";
import "./ChatPage.css";

const BOT_AVATAR = "/avatars/ai-bot.avif";
const USER_AVATAR = "/avatars/user.svg";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text:
        "Hi 👋 I’m your AI Career Advisor.\n" +
        "Ask me about roles, skills, or whether you're ready for a specific job.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text: userText },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await askCareerQuestion(userText);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: "bot",
          text: data.answer || "I couldn't generate a response.",
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          from: "bot",
          text: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat-page-shell">
      <main className="chat-main">
        <header className="chat-hero">
          <div>
            <span className="ai-badge">✨ AI Career Advisor</span>
            <h1>
              Career <span>Q&amp;A</span>
            </h1>
            <p>Clear guidance on roles, skills, and next steps.</p>
          </div>

          <img
            src="/vectors/ai-chat.avif"
            alt="AI Career Advisor"
            className="chat-hero-illustration"
          />
        </header>

        <div className="chat-shell">
          <div className="chat-messages">
            {messages.map((msg, i) => {
              const grouped = messages[i - 1]?.from === msg.from;

              return (
                <div
                  key={msg.id}
                  className={`chat-row ${msg.from} ${
                    grouped ? "grouped" : ""
                  }`}
                >
                  {!grouped && (
                    <img
                      src={msg.from === "bot" ? BOT_AVATAR : USER_AVATAR}
                      className="chat-avatar"
                      alt=""
                    />
                  )}

                  <div className="chat-bubble">
                    {msg.text.split("\n").map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="chat-row bot">
                <img src={BOT_AVATAR} className="chat-avatar" alt="" />
                <div className="chat-bubble ai-skeleton">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-bar" onSubmit={handleSend}>
            <img src={BOT_AVATAR} className="bot-mini" alt="" />
            <input
              placeholder="Ask: Am I ready for frontend developer roles?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="btn btn-primary" disabled={loading}>
              Ask AI
            </button>
          </form>
        </div>
      </main>
    </section>
  );
}
