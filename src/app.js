import express from "express";
const app = express();
import cors from "cors";
import { configDotenv } from "dotenv";
import indexRoute from "./Indexroute/Index.routes.js";
import morgan from "morgan";
import { ConnectDB } from "./config/DB.js";
configDotenv();
ConnectDB();

app.use(morgan("dev"));



app.use(express.json());
app.use(express.urlencoded({extended:true}));



app.use(cors({
    origin: true,
    credentials: true,
    methods:['GET','POST','PATCH','DELETE','PUT']
}));


app.use("/api", indexRoute);





const port  = process.env.PORT || 9000

app.listen(port, ()=>{
    console.log(`SERVER IS RUNNING ON ${port} PORT`);

})


