
import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { AdminOrderDetails } from "../controllers/admin.all.order.controlles.js";


const route = express.Router();


route.get("/get-all-orders", auth, adminOnly, AdminOrderDetails);



export default route;