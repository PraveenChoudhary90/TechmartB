

import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/CategoryController.js";

const route  = express.Router();

route.post("/add-category", auth, adminOnly,createCategory)
route.get("/get-category" ,auth, adminOnly, getAllCategories)
route.put("/update-category/:id", auth, adminOnly,updateCategory )
route.get("/getbyid-category/:id", auth, adminOnly,getCategoryById )
route.delete("/delete-category/:id", auth, adminOnly, deleteCategory);

export default route;