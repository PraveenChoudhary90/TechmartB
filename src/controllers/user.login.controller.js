import User from "../models/user.model.js";
import OTPModel from "../models/otp.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendOTPEmail } from "../utils/email.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ===============================
// 🔥 OTP GENERATOR
// ===============================
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ===============================
// 📩 SEND OTP (EMAIL VERIFICATION)
// ===============================
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUser = await User.findOne({ "email.primary": email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // delete old otp if exists
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();

    await OTPModel.create({
      email,
      code: otp,
      expireAt: Date.now() + 9 * 60 * 1000,
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// 🔐 VERIFY OTP
// ===============================
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTPModel.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (record.code !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    await OTPModel.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// 🧾 REGISTER USER (AFTER OTP VERIFIED)
// ===============================
export const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ "email.primary": email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: { primary: email },
      phone: { primary: phone },
      password: hashedPassword,
      role: role || "user",
      isVerified: true,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// 🔐 LOGIN
// ===============================
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ "email.primary": email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userData,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};