import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { sendOTPEmail } from "../utils/email.js";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;


// 🔥 OTP generator
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};



// ===============================
// 🔐 SIGNUP + OTP SEND
// ===============================
export const userSignup = async (req, res) => {
  try {
    const { name, email, phone, city, password, role } = req.body;

    // check user exists
    const existingUser = await User.findOne({ "email.primary": email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = generateOTP();

    // create user
    const user = await User.create({
      name,
      email: { primary: email },
      phone: { primary: phone },
      city,
      password: hashedPassword,
      role: role || "user",
      otp: {
        code: otp,
        expireAt: Date.now() + 5 * 60 * 1000, // 5 min
      },
      isVerified: false,
    });

    // send OTP email
    await sendOTPEmail(email, otp);

    return res.status(201).json({
      success: true,
      message: "User created. OTP sent to email.",
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
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ "email.primary": email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Already verified",
      });
    }

    if (!user.otp || !user.otp.code) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (user.otp.code.toString() !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (user.otp.expireAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    return res.json({
      success: true,
      message: "OTP verified successfully",
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
        message: "Please verify your account first",
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
      {
        id: user._id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: _, otp, ...userData } = user.toObject();

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