
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Name, email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: "User with this email already exists" });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });

    user.usage = user.usage || {};
    user.usage.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { register, login };
