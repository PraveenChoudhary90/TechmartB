
import express from "express";
import UserLoginRoute from "../routes/UserLoginRoute.js";
const route = express.Router();

route.use("/user",UserLoginRoute);


export default route;