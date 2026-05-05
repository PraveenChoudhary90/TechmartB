

import express from "express";
import AdminLoginRoute from "../routes/admin.login.routes.js";
import ProductsRoutes from '../routes/products.routes.js';
import CategoryRoutes from '../routes/category.routes.js';
import AttributeRoutes from '../routes/attribute.routes.js';
import BannerRoute from '../routes/banner.routes.js';
import OrderPaymnet from "../routes/payment.order.routes.js";
import UserLoginRoute from "../routes/user.login.routes.js";
import UserGetAllProducts from "../routes/user.products.routes.js";
import Addtocartroute from "../routes/addtocart.routes.js"
import UserBanners from "../routes/user.products.routes.js"
import AdminAllOrders from "../routes/admin.all.orders.routes.js";
import UserAllOrders from "../routes/user.all.orders.routes.js";
import OrderStatusAdminRoute from "../routes/update.order.delevery.status.routes.js";

const route = express.Router();


route.use("/admin", AdminLoginRoute, AdminAllOrders);
route.use("/product",ProductsRoutes);
route.use("/category",CategoryRoutes);
route.use("/attribute",AttributeRoutes);
route.use("/banner",BannerRoute);
route.use("/orderstatus",OrderStatusAdminRoute);



route.use("/user",UserLoginRoute, UserAllOrders);
route.use("/user-products",UserGetAllProducts);
route.use("/user-cart",Addtocartroute);
route.use("/user-banners",UserBanners);






route.use("/payment",OrderPaymnet);



export default route;