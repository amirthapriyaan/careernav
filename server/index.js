// server/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

/* middleware */
app.use(cors());
app.use(express.json());

/* health check */
app.get("/", (req, res) => {
  res.send("CareerNav Backend is running 🚀");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerNav API running"
  });
});
/* safely load route files */
function safeRequireRoute(relPath) {
  try {
    const fullPath = path.join(__dirname, relPath);
    const mod = require(fullPath);

    if (typeof mod === "function") {
      console.log(`[OK] Loaded route: ${relPath}`);
      return mod;
    }

    console.warn(`[WARN] ${relPath} did not export a router`);
    return null;
  } catch (err) {
    console.error(`[ERR] Failed loading ${relPath}:`, err.message);
    return null;
  }
}

/* api routes */
const routes = [
  { mount: "/api/match", path: "./routes/matchRoutes" },
  { mount: "/api/chat", path: "./routes/chatRoutes" },
  { mount: "/api/upload", path: "./routes/uploadRoutes" },
  { mount: "/api/auth", path: "./routes/auth" },
  { mount: "/api/user", path: "./routes/userData" },
];

/* mount routes */
routes.forEach(({ mount, path }) => {
  const router = safeRequireRoute(path);
  if (router) {
    app.use(mount, router);
    console.log(`[MOUNTED] ${mount}`);
  }
});

/* basic ping */
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});

/* mongodb connection */
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB_NAME || "career_compass",
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
