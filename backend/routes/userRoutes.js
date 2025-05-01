const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const isAuthenticated = require("../middlewares/verifyToken");

const router = express.Router();

// JWT secret and expiration
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = "7d"; // Token expiration time

/**
 * @route   POST /login
 * @desc    User login with email and password
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate credentials
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JWT with the user's role
    const token = jwt.sign({ id: user._id, role: user.role || "user" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Send the token to the client
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @route   GET /google
 * @desc    Start Google OAuth login process
 * @access  Public
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @route   GET /google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const { email, name } = req.user; // `req.user` is populated by Passport

      // Check if user exists in the database
      let user = await User.findOne({ email });

      // Create new user if they don't exist
      if (!user) {
        user = new User({
          email,
          name,
          googleId: req.user.id,
          role: "user", // Default role for Google OAuth users
        });
        await user.save();
      }

      // Generate a JWT
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      // Redirect to frontend with the JWT
      res.redirect(`http://localhost:5173/user-dashboard?token=${token}`);
    } catch (error) {
      console.error("Error during Google authentication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

/**
 * @route   GET /user-dashboard
 * @desc    User dashboard (protected route)
 * @access  Private
 */
router.get("/user-dashboard", isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const user = await User.findById(req.user.id, "email name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Welcome to your dashboard!",
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with name, email, and password
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Return a success response
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
