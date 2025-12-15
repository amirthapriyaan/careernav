import React, { useState, useRef, useEffect } from "react";
import "./ChatPage.css";

const BOT_AVATAR = "/avatars/ai-bot.avif";
const USER_AVATAR = "/avatars/user.svg";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text: "Hi 👋 I’m your AI Career Advisor.\nAsk me about roles, skills, or whether you're ready for a specific job.",
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
    setMessages((m) => [...m, { id: Date.now(), from: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, userId: "guest" }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: data.answer },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: Date.now() + 2, from: "bot", text: "Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="chat-page-shell">
      <div className="chat-layout">
        <main className="chat-main">

          <header className="chat-hero">
            <div>
              <span className="ai-badge">✨ AI Career Advisor</span>
              <h1>Career <span>Q&amp;A</span></h1>

              <p>⭐ Clear clarity on roles, skills, and the right next steps.</p>
              <p>⭐ Interview-ready guidance designed to help you from day one.</p>
              <p>⭐ Focused, meaningful answers instead of long explanations.</p>
              <p>⭐ Built to help you move forward with confidence.</p>
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
                    className={`chat-row ${msg.from} ${grouped ? "grouped" : ""}`}
                  >
                    {!grouped && (
                      <img
                        src={msg.from === "bot" ? BOT_AVATAR : USER_AVATAR}
                        className="chat-avatar"
                        alt=""
                      />
                    )}

                    <div className="chat-bubble">
                      <div className="chat-content">
                        {msg.text.split("\n").map((line, idx) => (
                          <p key={idx}>{line}</p>
                        ))}
                      </div>
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
      </div>
    </section>
  );
}
