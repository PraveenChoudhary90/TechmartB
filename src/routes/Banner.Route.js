import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { createBanner, deleteBanner, getAllBanners, updateBanner } from "../controllers/Banner.Controller.js";


const route = express.Router();


route.post("/create-banner", auth, adminOnly, createBanner);
route.get("/get-banner", auth, adminOnly, getAllBanners);
route.put("/update-banner/:id", auth, adminOnly, updateBanner);
route.delete("/delete-banner/:id", auth, adminOnly, deleteBanner);

export default route;