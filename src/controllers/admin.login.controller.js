import Admin from "../models/admin.model.js";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";
configDotenv();

const JWT_SECRET = process.env.JWT_SECRET;

export const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔹 find admin (password ke saath)
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔹 password compare
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔹 generate token
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 remove password before sending response
    const adminData = admin.toObject();
    delete adminData.password;

    // 🔹 response
    return res.status(200).json({
      success: true,
      message: "Admin login successfully",
      token,
      admin: adminData,
    });

  } catch (error) {
    console.error("Admin Login Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};