// require('dotenv').config({path:"./env"})
import dotenv from 'dotenv'
import express from "express";
import connectDB from "./db/index.js";
const app = express();

dotenv.config({path:"./env"})

// METHOD 2 THROUGH OTHER FILE
connectDB();








/*   ------------------------------------------------APPROACH 1 TO CONNECT WITH DB ------------------------------------------------
;(async()=>{

    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
      app.on("error",(error)=>{
        console.log("Error");
        throw error;
      })
      app.listen(process.env.PORT,()=>{
        console.log(`App is listening on ${process.env.PORT}`)
      })
    } catch (error) {
        console.error("Error connecting", error);
        throw error;
    }
})()
*/