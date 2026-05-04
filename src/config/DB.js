
import mongoose from "mongoose";


export const ConnectDB = async()=>{
    try {
       const res  =await  mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("DB IS CONNECTED SUCCESSFULLY")
        })
    } catch (error) {
        console.log(error);
    }
}