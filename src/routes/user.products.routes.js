
import express from "express";
import { getAllUserProducts } from "../controllers/user.products.controller.js";
import { getAllBanners } from "../controllers/banner.controller.js";

const route = express.Router();

route.get("/get-products", getAllUserProducts);
route.get("/get-banners", getAllBanners);

export default route;
