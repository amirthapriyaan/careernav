import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatMessage.css";

export default function ChatMessage({ text, from }) {
  function copyText() {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className={`chat-bubble ${from}`}>
      <button className="copy-btn" onClick={copyText} title="Copy">
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
        {text}
      </ReactMarkdown>
    </div>
  );
}
