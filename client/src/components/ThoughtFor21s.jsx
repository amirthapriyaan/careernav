import React, { useEffect, useState } from "react";

const QUOTES = [
  "Every application you submit is an opportunity to refine your story, sharpen your skills, and move one step closer to the role you truly want.",
  "Strong projects, clear explanations, and consistent learning habits speak far louder than buzzwords or long lists of tools on a resume.",
  "Consistency always beats intensity — learning a little every day compounds into real confidence, clarity, and long-term career growth.",
  "You don’t need to know everything to begin; you only need enough clarity to take the next meaningful step forward.",
  "Career growth is not about rushing results, but about building skills, confidence, and direction at a pace you can sustain.",
];

export default function ThoughtFor21s() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % QUOTES.length);
    }, 21000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        .t21-wrapper {
          width: 100%;
          background: linear-gradient(
            90deg,
            rgba(124,58,237,0.08),
            rgba(37,99,235,0.06)
          );
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }

        .t21-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 6px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #1e3a8a;
        }

        .t21-badge {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(124,58,237,0.12);
          color: #6d28d9;
          white-space: nowrap;
        }

        .t21-marquee {
          overflow: hidden;
          flex: 1;
        }

        .t21-text {
          display: inline-block;
          white-space: nowrap;
          padding-left: 100%;
          animation: t21-scroll 28s linear infinite;
        }

        @keyframes t21-scroll {
          to { transform: translateX(-100%); }
        }

        :root[data-theme="dark"] .t21-wrapper {
          background: linear-gradient(
            90deg,
            rgba(139,92,246,0.18),
            rgba(96,165,250,0.14)
          );
          border-bottom-color: rgba(255,255,255,0.08);
        }

        :root[data-theme="dark"] .t21-container {
          color: #e5e7eb;
        }

        :root[data-theme="dark"] .t21-badge {
          background: rgba(139,92,246,0.25);
          color: #e9d5ff;
        }

        @media (prefers-reduced-motion: reduce) {
          .t21-text {
            animation: none;
            padding-left: 0;
          }
        }
      `}</style>

      <div className="t21-wrapper">
        <div className="t21-container">
          <span className="t21-badge">Quotes of the Day</span>
          <div className="t21-marquee">
            <div key={index} className="t21-text">
              {QUOTES[index]}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
