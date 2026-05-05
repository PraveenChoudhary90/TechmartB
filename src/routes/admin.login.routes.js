
import express from "express";
import { AdminLogin } from "../controllers/admin.login.controller.js";

const route = express.Router();


route.post("/login", AdminLogin);




export default route;