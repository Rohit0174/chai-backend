// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { app } from "./app.js"; //THIS APP WILL BE IMPORTED FROM APP.JS

dotenv.config({ path: "./env" });

// METHOD 2 THROUGH OTHER FILE
connectDB() //THIS IS A ASYNC FUNCTION SO IT WILL RETURN A PROMISE
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("MONGODB connection failed", err));

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
