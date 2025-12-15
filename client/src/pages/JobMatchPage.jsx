import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeMatch, getATSHint, analyzeJD } from "../services/api";
import "./JobMatchPage.css";
import api from "../services/api";
import PdfUpload from "../components/PdfUpload";
import Spinner from "../components/Spinner";
import PageShell from "../components/PageShell";

export default function JobMatchPage() {
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [jdResult, setJdResult] = useState(null);
  const [analyzingJD, setAnalyzingJD] = useState(false);

  useEffect(() => {
    if (!jobDescription || jobDescription.trim().length < 10) {
      setJdResult(null);
      return;
    }

    let active = true;
    const id = setTimeout(async () => {
      try {
        setAnalyzingJD(true);
        const res = await analyzeJD(jobDescription);
        if (active) setJdResult(res || { mustHave: [], goodToHave: [] });
      } catch {
        if (active) setJdResult(null);
      } finally {
        if (active) setAnalyzingJD(false);
      }
    }, 700);

    return () => {
      active = false;
      clearTimeout(id);
    };
  }, [jobDescription]);

  async function saveAnalysis(data) {
    try {
      await api.post("/user/analysis", data);
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please paste both Job Description and Resume text.");
      return;
    }

    try {
      setLoading(true);

      const analysis = await analyzeMatch(jobDescription, resumeText);

      if (analysis?.missingSkills) {
        localStorage.setItem(
          "cc_last_missing_skills",
          JSON.stringify(analysis.missingSkills)
        );
      }

      let atsHint = null;
      try {
        atsHint = await getATSHint(jobDescription, resumeText);
      } catch {}

      let jd = jdResult;
      if (!jd) {
        try {
          jd = await analyzeJD(jobDescription);
        } catch {
          jd = { mustHave: [], goodToHave: [] };
        }
      }

      const payload = {
        analysis,
        jdResult: jd,
        atsHint,
        jobDescription,
        resumeText,
      };

      saveAnalysis({
        score: analysis?.score,
        strengths: analysis?.matchedSkills,
        gaps: analysis?.missingSkills,
        atsHints: atsHint,
        jobDescription,
        resumeText,
      });

      sessionStorage.setItem("cc_last_analysis", JSON.stringify(payload));
      navigate("/job-match/result", { state: payload });

    } catch {
      setError("Something went wrong while analyzing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="jm-page">
      <PageShell className="jobmatch-shell">
        <div className="jm-shell">

          <header className="jm-header">
            <h1>Job Match Analyzer</h1>
            <p className="jm-subtitle">
              Compare your resume with a job description and get clear,
              actionable feedback.
            </p>
          </header>

          <form className="jm-grid" onSubmit={handleSubmit}>
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

              <small className="muted">
                {analyzingJD
                  ? "Analyzing job description..."
                  : "JD skills auto-extract while you type."}
              </small>
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
                {loading ? <Spinner size={22} /> : "Analyze Match"}
              </button>
            </div>
          </form>

        </div>
      </PageShell>
    </div>
  );
}
