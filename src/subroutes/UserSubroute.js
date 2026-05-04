
import express from "express";
import UserLoginRoute from "../routes/UserLoginRoute.js";
import UserGetAllProducts from "../routes/UserProductsRoute.js";
import Addtocartroute from "../routes/Addtocart.route.js"
const route = express.Router();

route.use("/user",UserLoginRoute);
route.use("/user-get-allproducts",UserGetAllProducts);
route.use("/user-cart",Addtocartroute);


export default route;