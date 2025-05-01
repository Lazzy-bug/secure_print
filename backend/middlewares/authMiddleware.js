const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Owner = require("../models/Owner");
const Shop = require("../models/Shop");

// Authentication middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // Fetch user details

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Fetch owner or shop details if needed
    if (req.user.role === 'Owner') {
      req.owner = await Owner.findById(decoded.id);
    }
    
    if (req.user.role === 'Shop') {
      req.shop = await Shop.findById(decoded.id);
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    
    // Handle expired token error separately
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token has expired" });
    }
    
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

// Authorization middleware for role-based access
const authorize = (roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: User not authenticated" });
  }

  // Check if the user has the required role
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Forbidden: Access denied for ${req.user.role} users` });
  }

  // Additional check if an owner is accessing their own resources
  if (req.user.role === 'Owner' && req.owner) {
    const ownerId = req.params.ownerId || req.body.ownerId;
    if (req.owner._id.toString() !== ownerId) {
      return res.status(403).json({ message: "Forbidden: You do not have permission to access this resource" });
    }
  }

  next(); // Proceed to the next middleware or route handler
};

module.exports = { authenticate, authorize };
