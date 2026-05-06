
import express from "express";
import {  auth, userOnly } from "../middleware/authMiddleware.js";
import { getAllUserOrders } from "../controllers/user.all.orders.controllers.js";


const route = express.Router();


route.get("/get-all-orders", auth, userOnly, getAllUserOrders);



export default route;



