// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },  // Only for email/password login
  googleId: { type: String },  // Only for Google OAuth login
  name: { type: String },
  role: { type: String, default: "user" },  // Only for Google OAuth login (optional, if user is authenticated via Google)
});

const User = mongoose.model("User", userSchema);

module.exports = User;
