import express from "express";
import { adminOnly, auth } from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/ProductsController.js";


const route = express.Router();

// CREATE
route.post("/add-product", auth, adminOnly, upload.array("images", 5), addProduct);

// READ
route.get("/getallproducts", auth, adminOnly, getAllProducts);
route.get("/getProductbyid/:id", auth, adminOnly, getProductById);

// UPDATE
route.put("/updateProduct/:id", auth, adminOnly,upload.array("images",5), updateProduct);

// DELETE (soft)
route.delete("/deleteProducts/:id", auth, adminOnly, deleteProduct);

export default route;