const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header missing or malformed.");
    return res.status(401).json({ message: "Authorization token required." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

  try {
    // Verify the token and attach the decoded payload to the request object
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Log the decoded token for debugging purposes
    console.log("Token verified successfully:", decoded);

    req.user = decoded; // Attach the decoded token payload to `req.user`
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle token verification errors
    console.error("Token verification failed:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired." });
    }

    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyToken;
