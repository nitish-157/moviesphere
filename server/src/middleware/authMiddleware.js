import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the JWT sent in the Authorization header and attaches
// the logged-in user (minus password) to req.user
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id); // password excluded by default (select:false)

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid or expired token" });
  }
};

// Use after `protect` - only allows the request through if the user is an admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ success: false, message: "Admin access required" });
};
