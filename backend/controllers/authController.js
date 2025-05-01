const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid email or password");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { register, login };
