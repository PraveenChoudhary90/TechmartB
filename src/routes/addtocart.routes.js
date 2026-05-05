
import express from "express";
import { auth, userOnly } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, updateCartQuantity, clearCart, checkout } from "../controllers/addtocart.controller.js";
const route = express.Router();


route.post("/add-to-cart", auth, userOnly, addToCart);
route.get("/view-cart", auth, userOnly, getCart);
route.post("/remove-from-cart", auth, userOnly, removeFromCart);
route.put("/update-quantity", auth, userOnly, updateCartQuantity);
route.delete("/clear-cart", auth, userOnly, clearCart);
route.get("/checkout", auth, userOnly, checkout);


export default route;
