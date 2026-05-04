
import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { getAllUserProducts } from "../controllers/UserProducts.Controller.js";

const route = express.Router();

route.get("/get-products", auth, adminOnly, getAllUserProducts);

export default route;