import React, { useEffect, useState } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import "./RoadmapPage.css";

export default function RoadmapPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [notification, setNotification] = useState(null);
  const [toRemoveIndex, setToRemoveIndex] = useState(null);

  /* ================= LOAD ROADMAP ================= */
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await api.get("/user/me");
        const roadmap = res.data?.roadmap;

        if (roadmap?.steps?.length) {
          const transformed = roadmap.steps.map((s) => ({
            name: s.title || s.name,
            status: mapBackendToUIStatus(s.status),
            resources: s.suggestedResources || getResourcesForSkill(s.title || s.name),
            projectIdea: s.projectIdea || getProjectIdea(s.title || s.name),
          }));
          mounted && setSkills(transformed);
          return;
        }

        const gaps = res.data?.lastAnalyses?.[0]?.gaps || [];
        if (gaps.length) {
          mounted &&
            setSkills(
              gaps.map((g) => ({
                name: g,
                status: "not-started",
                resources: getResourcesForSkill(g),
                projectIdea: getProjectIdea(g),
              }))
            );
          return;
        }

        const saved = localStorage.getItem("cc_last_missing_skills");
        if (saved) {
          mounted &&
            setSkills(
              JSON.parse(saved).map((g) => ({
                name: g,
                status: "not-started",
                resources: getResourcesForSkill(g),
                projectIdea: getProjectIdea(g),
              }))
            );
        }
      } catch (err) {
        console.error("Load roadmap error:", err);
      } finally {
        mounted && setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  /* ================= STATUS MAP ================= */
  const mapBackendToUIStatus = (st) =>
    st === "doing" ? "in-progress" : st === "done" ? "done" : "not-started";

  const mapUIToBackendStatus = (st) =>
    st === "in-progress" ? "doing" : st === "done" ? "done" : "todo";

  /* ================= RESOURCES ================= */
  function getResourcesForSkill(skill) {
    const s = (skill || "").toLowerCase();
    const map = {
      java: [{ title: "Java Docs", url: "https://docs.oracle.com/javase/tutorial/" }],
      sql: [{ title: "SQLBolt", url: "https://sqlbolt.com/" }],
      react: [{ title: "React Docs", url: "https://react.dev/learn" }],
      node: [{ title: "Node Docs", url: "https://nodejs.org/en/docs" }],
    };

    return (
      map[s] || [
        {
          title: `Search ${skill} on YouTube`,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}`,
        },
      ]
    );
  }

  function getProjectIdea(skill) {
    return `Build a small project to demonstrate ${skill}.`;
  }

  /* ================= TOAST ================= */
  function showNotification(type, msg, ms = 3500) {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), ms);
  }

  /* ================= SAVE ================= */
  async function saveRoadmapToBackend(list) {
    setSaving(true);
    try {
      const steps = list.map((s, i) => ({
        id: `${s.name}_${i}`,
        title: s.name,
        status: mapUIToBackendStatus(s.status),
        suggestedResources: s.resources,
        projectIdea: s.projectIdea,
      }));

      await api.put("/user/roadmap", { title: "Learning Roadmap", steps });
      localStorage.setItem("cc_last_missing_skills", JSON.stringify(list.map((x) => x.name)));
      showNotification("success", "Roadmap saved");
    } catch (e) {
      showNotification("error", "Save failed");
    } finally {
      setSaving(false);
    }
  }

  /* ================= ACTIONS ================= */
  async function handleStatusChange(i, status) {
    const updated = [...skills];
    updated[i].status = status;
    setSkills(updated);
    saveRoadmapToBackend(updated);
  }

  async function handleAddSkill() {
    const name = newSkill.trim();
    if (!name) return;

    if (skills.some((s) => s.name.toLowerCase() === name.toLowerCase())) {
      showNotification("info", "Skill already exists");
      return;
    }

    const updated = [
      {
        name,
        status: "not-started",
        resources: getResourcesForSkill(name),
        projectIdea: getProjectIdea(name),
      },
      ...skills,
    ];

    setSkills(updated);
    setNewSkill("");
    saveRoadmapToBackend(updated);
  }

  async function handleRemoveSkill(i) {
    if (toRemoveIndex !== i) return setToRemoveIndex(i);

    const updated = skills.filter((_, idx) => idx !== i);
    setSkills(updated);
    setToRemoveIndex(null);
    saveRoadmapToBackend(updated);
  }

  /* ================= PDF ================= */
  function handleDownloadPdf() {
    if (!skills.length) return showNotification("info", "No roadmap available");

    const doc = new jsPDF();
    let y = 20;
    doc.text("Career Compass – Learning Roadmap", 10, y);
    y += 10;

    skills.forEach((s, i) => {
      doc.text(`${i + 1}. ${s.name} (${s.status})`, 10, y);
      y += 8;
    });

    doc.save("career-learning-roadmap.pdf");
  }

  if (loading) return <div className="rm-loading">Loading roadmap...</div>;

  return (
    <div className="rm-page">
      <header className="rm-header">
        <h1>Learning Roadmap</h1>
        <p className="rm-subtitle">Track progress and close your skill gaps</p>
      </header>

      <div className="rm-toolbar">
        <div className="rm-add">
          <input
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <button className="btn" onClick={handleAddSkill}>Add</button>
        </div>

        <div className="rm-actions">
          <button className="btn ghost" onClick={handleDownloadPdf}>Download PDF</button>
          <button className="btn" disabled={saving} onClick={() => saveRoadmapToBackend(skills)}>
            {saving ? "Saving..." : "Save Roadmap"}
          </button>
        </div>
      </div>

      <div className="rm-grid">
        {skills.length === 0 ? (
          <div className="rm-empty">No roadmap available</div>
        ) : (
          skills.map((s, i) => (
            <div className="rm-card" key={s.name + i}>
              <div className="rm-card-top">
                <h3 className="rm-skill">{s.name}</h3>

                <div className="rm-card-controls">
                  <select value={s.status} onChange={(e) => handleStatusChange(i, e.target.value)}>
                    <option value="not-started">⏳ Not Started</option>
                    <option value="in-progress">🚧 In Progress</option>
                    <option value="done">🔥 Completed</option>
                  </select>

                  {toRemoveIndex === i ? (
                    <>
                      <button className="btn danger small" onClick={() => handleRemoveSkill(i)}>Confirm</button>
                      <button className="btn ghost small" onClick={() => setToRemoveIndex(null)}>Cancel</button>
                    </>
                  ) : (
                    <button className="btn danger small" onClick={() => handleRemoveSkill(i)}>Remove</button>
                  )}
                </div>
              </div>

              <div className="rm-section">
                <div className="rm-section-title">Learning Resources</div>
                <ul className="rm-resources">
                  {s.resources.map((r, idx) => (
                    <li key={idx}>
                      <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rm-section">
                <div className="rm-section-title">Mini Project Idea</div>
                <div className="rm-project">{s.projectIdea}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {notification && (
        <div className={`cc-toast cc-${notification.type}`}>{notification.msg}</div>
      )}
    </div>
  );
}
