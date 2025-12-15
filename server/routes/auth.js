
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

function createToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name = '', email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email, passwordHash });
    const token = createToken(user);

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    user.usage = user.usage || {};
    user.usage.lastLogin = new Date();
    await user.save();

    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
