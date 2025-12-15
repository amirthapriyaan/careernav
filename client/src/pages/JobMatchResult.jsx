import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./JobMatchResult.css";

export default function JobMatchResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const payload = useMemo(() => {
    if (location.state) return location.state;
    try {
      const raw = sessionStorage.getItem("cc_last_analysis");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  if (!payload) {
    return (
      <div className="jmr-page">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h3>No analysis found</h3>
      </div>
    );
  }

  const { analysis, jdResult, atsHint } = payload;

  const ats = atsHint || {
    atsScore: 0,
    keywordMatchPct: 0,
    skillsSection: false,
    suggestions: ["Run analysis again to generate ATS insights."]
  };

  const matchPct = Math.min(100, Math.max(0, (analysis.score / 10) * 100));

  return (
    <div className="jmr-page">
      <div className="jmr-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back to Paste
        </button>
        <h1>Analysis Results</h1>
        <p>Clear breakdown of your job–resume alignment</p>
      </div>

      <div className="jmr-top">
        <div className="jmr-score-card">
          <div
            className="jmr-score-ring"
            style={{
              background: `conic-gradient(
                #6366f1 ${matchPct}%,
                rgba(99,102,241,0.15) ${matchPct}%
              )`
            }}
          >
            <div className="jmr-score-inner">
              <div className="jmr-score">{analysis.score}</div>
              <div className="jmr-score-sub">/10</div>
            </div>
          </div>

          <p className="jmr-level">{analysis.level}</p>
          <p className="jmr-muted">{analysis.explanation}</p>
        </div>

        <div className="jmr-summary-card">
          <h3>Summary</h3>
          <p>{analysis.explanation}</p>

          <div className="jmr-tip">
            <strong>Actionable Tip</strong>
            <p>{analysis.tip}</p>
          </div>
        </div>
      </div>

      <div className="jmr-grid">
        <div className="jmr-card">
          <h3>JD Analysis</h3>
          <p className="jmr-muted">Auto-extracted from job description</p>
          <p>{jdResult?.summary || "—"}</p>
        </div>

        <div className="jmr-card">
          <h3>Details</h3>

          <div className="jmr-details-grid">
            <Detail title="Must-have" list={jdResult?.mustHave} type="must" />
            <Detail title="Good-to-have" list={jdResult?.goodToHave} type="good" />
            <Detail title="Strengths" list={analysis.matchedSkills} type="strong" />
            <Detail title="Gaps" list={analysis.missingSkills} type="gap" />
          </div>
        </div>
      </div>

      <div className="jmr-ats">
        <h3>ATS Score</h3>

        <div className="jmr-ats-body">
          <div className="jmr-ats-ring" style={{ "--ats-pct": ats.atsScore }}>
            <div className="jmr-ats-inner">
              <div className="jmr-ats-value">{ats.atsScore}</div>
              <div className="jmr-ats-sub">/100</div>
            </div>
          </div>

          <div>
            <p><strong>Keyword Match:</strong> {ats.keywordMatchPct}%</p>
            <p>
              <strong>Skills Section:</strong>{" "}
              {ats.skillsSection ? "Present" : "Missing"}
            </p>
            <ul>
              {ats.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ title, list = [], type }) {
  return (
    <div className="jmr-detail-cell">
      <h4>{title}</h4>
      <div className="jmr-pill-wrap">
        {list && list.length > 0
          ? list.map((s, i) => (
              <span key={i} className={`jmr-pill jmr-pill-${type}`}>
                {s}
              </span>
            ))
          : <span className="jmr-muted">—</span>}
      </div>
    </div>
  );
}
