
import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { updateDeliveryStatusByAdmin } from "../controllers/update.delevery.status.controller.js";



const route = express.Router();


route.put("/status-update/:orderId",auth,adminOnly, updateDeliveryStatusByAdmin);



export default route;