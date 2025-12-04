const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const parts = header.split(" ");
    const token = parts[0] === "Bearer" ? parts[1] : undefined;
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) return res.status(401).json({ error: "Unauthorized" });
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = auth;
