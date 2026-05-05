import express from "express";
import {
  sendEmailOTP,
  verifyEmailOTP,
  userSignup,
  userLogin
} from "../controllers/user.login.controller.js";

const route = express.Router();

// 1. Send OTP (email verification start)
route.post("/send-otp", sendEmailOTP);

// 2. Verify OTP
route.post("/verify-otp", verifyEmailOTP);

// 3. Final Signup (after OTP verified)
route.post("/sign-up", userSignup);

// 4. Login
route.post("/login", userLogin);

export default route;