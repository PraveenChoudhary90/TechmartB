
import express from "express";
import UserLoginRoute from "../routes/UserLoginRoute.js";
import UserGetAllProducts from "../routes/UserProductsRoute.js";
const route = express.Router();

route.use("/user",UserLoginRoute);
route.use("/user-get-allproducts",UserGetAllProducts);


export default route;