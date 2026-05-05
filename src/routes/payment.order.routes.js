
import express from "express";
import { auth, userOnly } from "../middleware/authMiddleware.js";
import { createRazorpayOrder, verifyPaymentAndCreateOrder } from "../controllers/order.payment.controller.js";

const route = express.Router();

route.post("/create/orderid", auth, userOnly, createRazorpayOrder);
route.post("/payment/verify", auth, userOnly, verifyPaymentAndCreateOrder);

export default route;