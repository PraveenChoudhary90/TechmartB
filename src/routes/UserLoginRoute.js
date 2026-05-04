
import express from "express";
import { userLogin, userSignup, verifyOTP } from "../controllers/UserLoginController.js";

const route = express.Router();

route.post("/sign-up", userSignup);
route.post("/verify-otp", verifyOTP);
route.post("/login", userLogin);


export default route;