import express from "express";
const app = express();
import cors from "cors";
import { configDotenv } from "dotenv";
import AdminSubRoute from "./subroutes/AdminSubroutes.js";
import UserSubRoute from "./subroutes/UserSubroute.js";
import OrderPaymnet from "./routes/Payment.order.route.js";
import morgan from "morgan";
import { ConnectDB } from "./config/DB.js";
configDotenv();
ConnectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));

app.use("/api/v1", AdminSubRoute);
app.use("/api/v1",UserSubRoute);
app.use("/api/v1/payment",OrderPaymnet);




const port  = process.env.PORT || 9000

app.listen(port, ()=>{
    console.log(`SERVER IS RUNNING ON ${port} PORT`);

})


