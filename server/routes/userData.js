
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/me", auth, async (req, res) => {
  const user = req.user;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    lastAnalyses: user.lastAnalyses,
    roadmap: user.roadmap,
    usage: user.usage,
  });
});

router.post("/analysis", auth, async (req, res) => {
  try {
    const user = req.user;

    const entry = {
      jobDescription: req.body.jobDescription || "",
      resumeText: req.body.resumeText || "",
      score: req.body.score || 0,
      strengths: req.body.strengths || [],
      gaps: req.body.gaps || [],
      atsHints: req.body.atsHints || [],
      interviewQs: req.body.interviewQs || [],
      createdAt: new Date(),
    };

    user.lastAnalyses.unshift(entry);
    user.lastAnalyses = user.lastAnalyses.slice(0, 3); // keep ONLY last 3
    user.usage.analysesCount = (user.usage.analysesCount || 0) + 1;

    await user.save();
    res.json({ ok: true });
  } catch (err) {
    console.error("Save analysis error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put('/roadmap', auth, async (req, res) => {
  try {
    const user = req.user;
    const { title = 'Learning Roadmap', steps = [] } = req.body;
    user.roadmap = { title, steps, updatedAt: new Date() };
    await user.save();
    return res.json({ ok: true, roadmap: user.roadmap });
  } catch (err) {
    console.error('PUT /user/roadmap error', err);
    return res.status(500).json({ error: 'Server save error' });
  }
});

// optional fallback route
router.put('/roadmap/save', auth, async (req, res) => {
  try {
    const user = req.user;
    const steps = req.body.steps || [];
    user.roadmap = { title: 'Learning Roadmap', steps, updatedAt: new Date() };
    await user.save();
    return res.json({ ok: true, roadmap: user.roadmap });
  } catch (err) {
    console.error('PUT /user/roadmap/save error', err);
    return res.status(500).json({ error: 'Server save error' });
  }
});

module.exports = router;
