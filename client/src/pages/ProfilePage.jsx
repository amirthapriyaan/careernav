import React, { useEffect, useState } from "react";
import api from "../services/api";
import { logout } from "../utils/auth";
import ProgressCircle from "../components/ProgressCircle";
import Tag from "../components/Tag";
import Spinner from "../components/Spinner";
import "./profile.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/user/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load user:", err);
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="full-page-loader center-vertical">
        <Spinner size={44} />
        <p className="muted">Loading profile…</p>
      </div>
    );

  if (!user) return <div className="center">Not signed in</div>;

  const avgScore =
    user.lastAnalyses && user.lastAnalyses.length
      ? Math.round(
          user.lastAnalyses.reduce((s, a) => s + (a.score || 0), 0) / user.lastAnalyses.length
        )
      : 0;

  const totalSteps = (user.roadmap?.steps || []).length;
  const doneSteps = (user.roadmap?.steps || []).filter((s) => s.status === "done").length;
  // const roadmapPct = totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0;

  // helper to render avatar (use user.avatarUrl if available)
  const Avatar = ({ user }) => {
    if (user?.avatarUrl) {
      return <img className="avatar-large avatar-img" src={user.avatarUrl} alt={user.name || "avatar"} />;
    }
    const initials = user?.name
      ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("")
      : (user?.email || "U").charAt(0).toUpperCase();
    return <div className="avatar-large">{initials}</div>;
  };

  return (
    
    <div className="profile-wrap page-enter" >
      <div className="profile-inner">
        {/* Header */}
        <header className="profile-top profile-header">
          <div className="profile-head-left">
            <Avatar user={user} />
            <div className="profile-head-meta">
              <div className="profile-name">{user.name || user.email}</div>
              <div className="profile-sub small muted">
                {user.title || user.headline} {/* optional */}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button
              className="btn btn-ghost"
              onClick={() => {
                window.location.href = "/job-match";
              }}
              aria-label="Run Job Match"
            >
              Run Job Match
            </button>

            <button className="btn btn-primary" onClick={logout} aria-label="Logout">
              Logout
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <section className="profile-grid">
          {/* Left summary */}
          <aside className="card summary-card">
            <div className="summary-header">
              <div>
                <h3 className="summary-title">Overall Readiness</h3>
                <p className="muted small">Average of recent analyses</p>
              </div>
            </div>

            <div className="summary-inner">
              <ProgressCircle size={120} value={avgScore} />
              <div className="summary-text">
                <div className="big">{avgScore}%</div>
                <div className="muted">Average of recent analyses</div>
              </div>
            </div>

            <div className="quick-links">
              <a href="/roadmap" className="link">Open Roadmap →</a>
              <a href="#analyses" className="link">View Analyses →</a>
            </div>

           
          </aside>

          {/* Right analyses */}
          <main className="card analyses-card" id="analyses">
            <div className="analyses-header">
              <h3>Recent Analyses</h3>
              <div className="small muted">{user.lastAnalyses?.length ?? 0} results</div>
            </div>

            {(!user.lastAnalyses || user.lastAnalyses.length === 0) ? (
              <div className="empty">No analyses yet. Run Job Match to generate your first roadmap step.</div>
            ) : (
              <div className="analyses-list">
                {user.lastAnalyses.map((a, i) => (
                  <article key={i} className="analysis-row card-elev">
                    <div className="analysis-main">
                      <div className="analysis-meta">
                        <div className="meta-date">{new Date(a.createdAt).toLocaleString()}</div>
                        <div className="meta-score"><strong>{a.score ?? "-"}</strong></div>
                      </div>

                      <div className="analysis-title">{a.jobDescription?.slice(0, 160) || "Untitled JD"}</div>

                      <div className="tag-row">
                        {(a.gaps || []).slice(0, 5).map((g, idx) => (
                          <Tag key={idx} text={g} tone="warn" />
                        ))}
                        {(a.strengths || []).slice(0, 3).map((s, idx) => (
                          <Tag key={`s${idx}`} text={s} tone="ok" />
                        ))}
                      </div>
                    </div>

                    <div className="analysis-actions">
                      <button
                        className="btn btn-analysis"
                        onClick={() => {
                          localStorage.setItem("cc_prefill_jd", a.jobDescription || "");
                          window.location.href = "/job-match";
                        }}
                      >
                        Re-run
                      </button>

                      <button
                        className="btn btn-primary" 
                        onClick={async () => {
                          setSaving(true);
                          try {
                            const firstGap = (a.gaps || [])[0];
                            if (!firstGap) return alert("No gap found to add.");
                            const curRoadmap = user.roadmap || { title: "Learning Roadmap", steps: [] };
                            const newStep = {
                              id: Date.now().toString(),
                              title: firstGap,
                              status: "todo",
                              notes: `Suggested from analysis on ${new Date(a.createdAt).toLocaleDateString()}`,
                              suggestedResources: [],
                            };
                            const exists = (curRoadmap.steps || []).some(
                              (s) => s.title.toLowerCase() === newStep.title.toLowerCase()
                            );
                            if (!exists) {
                              curRoadmap.steps = [...(curRoadmap.steps || []), newStep];
                              await api.put("/user/roadmap", curRoadmap);
                              const refreshed = await api.get("/user/me");
                              setUser(refreshed.data);
                              alert("Added to roadmap");
                            } else {
                              alert("That gap already exists in your roadmap.");
                            }
                          } catch (e) {
                            console.error(e);
                            alert("Could not add to roadmap");
                          } finally {
                            setSaving(false);
                          }
                        }}
                      >
                        {saving ? "Adding..." : " Add gap"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </section>

        {/* Roadmap snapshot bottom */}
        <section className="card roadmap-preview" style={{ marginTop: 20 }}>
          <h3>Your Roadmap Snapshot</h3>

          {(!user.roadmap || !user.roadmap.steps || user.roadmap.steps.length === 0) ? (
            <div className="empty">No roadmap yet. Run a job match or add gaps to generate your roadmap.</div>
          ) : (
            <>
              <div className="roadmap-preview-grid">
                {user.roadmap.steps.slice(0, 6).map((step, index) => (
                  <div key={step.id || index} className="roadmap-preview-card">
                    <div className="rpc-title">{step.title}</div>

                    <div className={`rpc-status ${step.status}`}>
                      {step.status === "todo" && "⏳ Not Started"}
                      {step.status === "doing" && "🚧 In Progress"}
                      {step.status === "done" && "🔥 Completed"}
                    </div>

                    <div className="rpc-progress">
                      <div
                        className={`rpc-progress-bar ${step.status}`}
                        style={{
                          width: step.status === "done" ? "100%" : step.status === "doing" ? "60%" : "8%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="roadmap-actions" style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                <a href="/roadmap" className="btn btn-primary">Open Full Roadmap →</a>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
