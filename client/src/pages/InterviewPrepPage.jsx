import React, { useState, useEffect } from "react";
import { getInterviewQuestions } from "../services/api";
import "./InterviewPrepPage.css";
import "./JobMatchPage.css";
import PdfUpload from "../components/PdfUpload";
import Spinner from "../components/Spinner";
import PageShell from "../components/PageShell";

const STATUS_OPTIONS = ["Not Practiced", "Practicing", "Practiced"];

export default function InterviewPrepPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cc_interview_questions");
    if (saved) {
      try {
        setQuestions(JSON.parse(saved));
        setStarted(true);
      } catch {}
    }
  }, []);

  async function handleGenerate(e) {
    e?.preventDefault();

    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please paste both Job Description and Resume text.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await getInterviewQuestions(jobDescription, resumeText);
      const withStatus = (data.questions || []).map(q => ({
        ...q,
        status: "Not Practiced",
      }));

      setQuestions(withStatus);
      localStorage.setItem("cc_interview_questions", JSON.stringify(withStatus));
      setStarted(true);
    } catch {
      setError("Failed to generate interview questions.");
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setStarted(false);
  }

  function handleStatusChange(index, status) {
    const updated = [...questions];
    updated[index].status = status;
    setQuestions(updated);
    localStorage.setItem("cc_interview_questions", JSON.stringify(updated));
  }

  const practiced = questions.filter(q => q.status === "Practiced").length;
  const completion = questions.length
    ? Math.round((practiced / questions.length) * 100)
    : 0;

  return (
    <div className="jm-page ip-page">
      <PageShell className="interview-shell">

        {!started && (
          <>
            <header className="jm-header">
              <h1>Interview Preparation</h1>
              <p className="jm-subtitle">
                Smart practice. Visible progress. Interview confidence.
              </p>
            </header>

            <form className="jm-grid" onSubmit={handleGenerate}>
              <div className="jm-card">
                <div className="jm-card-header">
                  <h2>Job Description</h2>
                  <span className="jm-hint">Paste from job portal</span>
                </div>

                <textarea
                  className="jm-textarea"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                />

                <PdfUpload label="Upload JD PDF" onExtracted={setJobDescription} />
              </div>

              <div className="jm-card">
                <div className="jm-card-header">
                  <h2>Resume</h2>
                  <span className="jm-hint">Paste resume text</span>
                </div>

                <textarea
                  className="jm-textarea"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume text here..."
                />

                <PdfUpload label="Upload Resume PDF" onExtracted={setResumeText} />
              </div>

              <div className="jm-actions">
                {error && <div className="jm-error">{error}</div>}
                <button className="btn btn-primary" disabled={loading}>
                  {loading ? <Spinner size={22} /> : "Generate Interview Questions"}
                </button>
              </div>
            </form>
          </>
        )}

        {started && (
          <>
            <div className="ip-practice-top">
              <div>
                <h2>Interview Questions</h2>
                <p>Practice, track progress, and master your answers</p>
              </div>
              <button className="ip-back-btn" onClick={handleBack}>
                ← Back to JD & Resume
              </button>
            </div>

            <div className="ip-progress">
              <div className="ip-progress-header">
                <span>Practice Progress</span>
                <strong>{completion}%</strong>
              </div>

              <div className="ip-progress-bar">
                <div
                  className="ip-progress-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>

              <div className="ip-progress-meta">
                <span>{practiced} practiced</span>
                <span>{questions.length - practiced} remaining</span>
              </div>
            </div>

            <div className="ip-question-list">
              {questions.map((q, i) => (
                <div key={i} className="ip-question-card-premium">
                  <div className="ip-q-header">
                    <span className="ip-q-index">Q{i + 1}</span>
                    <span className={`ip-status ${q.status.replace(/\s/g, "").toLowerCase()}`}>
                      {q.status}
                    </span>
                  </div>

                  <h3 className="ip-q-title">{q.question}</h3>

                  <p className="ip-answer">
                    <strong>Hint:</strong> {q.answer}
                  </p>

                  <div className="ip-q-footer">
                    <select
                      className="ip-status-select"
                      value={q.status}
                      onChange={(e) => handleStatusChange(i, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </PageShell>
    </div>
  );
}
