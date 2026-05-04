import jwt from "jsonwebtoken";
import Admin from "../models/AdminModel.js";
import User from "../models/UserModel.js";
import { configDotenv } from "dotenv";

configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

// console.log("Loaded JWT_SECRET:", JWT_SECRET); // Debug log

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // console.log("Auth Header:", authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1].trim();

    // console.log("Token:", token); // Debug log

    const decoded = jwt.verify(token, JWT_SECRET);

    // console.log("Decoded Token:", decoded);

    req.userId = decoded.id;
    req.userRole = decoded.role;

    let user;

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id).select("-password");
    } else if (decoded.role === "user") {
      user = await User.findById(decoded.id).select("-password");
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid role",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Auth Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
  next();
};

export const userOnly = (req, res, next) => {
  if (req.userRole !== "user") {
    return res.status(403).json({
      success: false,
      message: "User access only",
    });
  }
  next();
};