
import express from "express";
import AdminLoginRoute from "../routes/AdminLoginRoute.js";
import ProductsRoutes from '../routes/ProductsRoute.js';
import CategoryRoutes from '../routes/CateGoryRoute.js';
import AttributeRoutes from '../routes/AttributeRoute.js';
const route = express.Router();


route.use("/admin", AdminLoginRoute);
route.use("/product",ProductsRoutes);
route.use("/category",CategoryRoutes);
route.use("/attribute",AttributeRoutes);

export default route;