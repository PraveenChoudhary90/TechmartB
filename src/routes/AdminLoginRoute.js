
import express from "express";
import { AdminLogin } from "../controllers/AdminLoginController.js";

const route = express.Router();


route.post("/login", AdminLogin);




export default route;