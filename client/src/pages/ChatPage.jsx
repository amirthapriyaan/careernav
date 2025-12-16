import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatPage.css";

const BOT_AVATAR = "/avatars/ai-bot.avif";
const USER_AVATAR = "/avatars/user.svg";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: "bot",
      text:
        "Hi 👋 I’m your **AI Career Advisor**.\n\n" +
        "Ask me about **roles**, **skills**, or whether you're ready for a **specific job**.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);
const API_BASE =
  process.env.REACT_APP_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://careernav.onrender.com/api");


 async function handleSend(e) {
  e.preventDefault();
  if (!input.trim() || loading) return;

  const userText = input.trim();

  setMessages((prev) => [
    ...prev,
    { id: Date.now(), from: "user", text: userText },
  ]);

  setInput("");
  setLoading(true);

  try {
    let res;
    let data;

    // 🔹 Try production route first
    try {
      res = await fetch(`${API_BASE}/chat/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) throw new Error("ask failed");
      data = await res.json();
    } catch {
      // 🔹 Fallback to local route
      res = await fetch(`${API_BASE}/chat/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      if (!res.ok) throw new Error("career failed");
      data = await res.json();
    }

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
        text:
          "❌ Unable to connect to AI service.\n\n" +
          "Please check your backend or try again later.",
      },
    ]);
  } finally {
    setLoading(false);
  }
}


  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <section className="chat-page-shell">
      <div className="chat-layout">
        <main className="chat-main">
          <header className="chat-hero">
            <div>
              <span className="ai-badge">✨ AI Career Advisor</span>
              <h1>
                Career <span>Q&amp;A</span>
              </h1>
              <p>⭐ Know your specific job title and core responsibilities.</p>
              <p>⭐ Pinpoint the critical skills required versus your current capability.</p>
              <p>⭐ Set clear, measurable next steps for immediate upskilling.</p>
              <p>⭐ Use our platform to get personalized feedback on your trajectory.</p>
              <p>⭐ Take action daily and continuously adapt your strategy for growth.</p>
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

                    <div className={`chat-bubble ${msg.from}`}>
                      <button
                        className="copy-btn"
                        onClick={() => copyToClipboard(msg.text)}
                        title="Copy"
                      >
                        📋
                      </button>

                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ inline, children }) {
                            return inline ? (
                              <code className="inline-code">{children}</code>
                            ) : (
                              <pre className="code-block">
                                <code>{children}</code>
                              </pre>
                            );
                          },
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
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
