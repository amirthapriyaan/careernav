
const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { analyzeJDHandler } = require('../controllers/matchController');
// Attempt to load controllers
let matchController;
let atsController;

try {
  matchController = require("../controllers/matchController");
} catch (e) {
  console.error("Failed to load matchController:", e);
  matchController = {};
}

try {
  atsController = require("../controllers/atsController");
} catch (e) {
  console.error("Failed to load atsController:", e);
  atsController = {};
}

// Helper to safely attach route only if handler is a function
function safePost(path, handler, name) {
  if (typeof handler === "function") {
    router.post(path, handler);
  } else {
    console.warn(`Route ${path} NOT registered because handler "${name}" is not a function.`);
    router.post(path, (req, res) => {
      res.status(501).json({ error: `Handler "${name}" not available on server.` });
    });
  }
}

router.post('/analyze-jd', /* auth, */ analyzeJDHandler);
// Register routes safely
safePost("/analyze", matchController.analyze, "matchController.analyze");
safePost("/interview-questions", matchController.interviewQuestions, "matchController.interviewQuestions");
safePost("/ats-hint", atsController.atsHint, "atsController.atsHint");

module.exports = router;
