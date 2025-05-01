// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Admin = require("../models/Admin");
const Owner = require("../models/Owner"); 
const User = require("../models/User");  
const Shop = require("../models/Shop");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const router = express.Router();

// Admin Signup Route (POST)
router.post("/admin/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Return a success response
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/owner/signup", async (req, res) => {
    try {
      const { name, shopName, shopAddress, username, email, password } = req.body;
  
      // Validate input
      if (!name || !shopName || !shopAddress || !username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Check if owner already exists
      const existingOwner = await Owner.findOne({ email });
      if (existingOwner) {
        return res.status(400).json({ message: "Owner already exists" });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new owner
      const newOwner = new Owner({
        name,
        shopName,
        shopAddress,
        username,
        email,
        password: hashedPassword,
      });
  
      // Save the new owner to the database
      await newOwner.save();
      const shop = await Shop.create({
        name: shopName,
        owner: newOwner._id,
      });
      // Return a success response
      res.status(201).json({ message: "Owner created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // for users 
  router.post("/user/signup", async (req, res) => {
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
