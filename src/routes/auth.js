const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

const signToken = (user) => {
  const secret = process.env.JWT_SECRET;
  const payload = { sub: user.id };
  return jwt.sign(payload, secret, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, citizenName, citizenship } = req.body;
    if (!email || !password || !citizenName || !citizenship)
      return res.status(400).json({ error: "email, password, citizenName, citizenship required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, provider: "local", citizenName, citizenship });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, email: user.email, role: user.role, provider: user.provider, citizenName: user.citizenName, citizenship: user.citizenship } });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email and password required" });
    const user = await User.findOne({ email, provider: "local" });
    if (!user) return res.status(401).json({ error: "invalid credentials" });
    const ok = await bcrypt.compare(password, user.password || "");
    if (!ok) return res.status(401).json({ error: "invalid credentials" });
    const token = signToken(user);
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, provider: user.provider, citizenName: user.citizenName, citizenship: user.citizenship } });
  } catch (e) {
    res.status(500).json({ error: "server error" });
  }
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"], session: false }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/api/auth/facebook/failure" }),
  (req, res) => {
    const token = signToken(req.user);
    res.json({ token, user: { id: req.user.id, email: req.user.email, role: req.user.role, provider: req.user.provider, citizenName: req.user.citizenName, citizenship: req.user.citizenship } });
  }
);

router.get("/facebook/failure", (req, res) => {
  res.status(401).json({ error: "facebook auth failed" });
});

module.exports = router;
