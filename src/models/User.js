const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, default: "citizen" },
    provider: { type: String, required: true, enum: ["local", "facebook"] },
    facebookId: { type: String },
    name: { type: String },
    citizenName: { type: String },
    citizenship: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
