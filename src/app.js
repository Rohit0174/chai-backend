import express from "express";
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

// TO SET MIDDLEWARES AND CONFIGURATION WE WRITE APP.USE
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
//TO LIMIT THE AMOUT OF JSON THAT WE WILL RECEIVE FROM FRONTEND
app.use(express.json({limit:"16kb"}))

/*TO MAKE EXPRESS CHECK DATA THAT IS COMING FROM URL/PARAMS
EXTENDED TRUE IS FOR NESTED OBJECTS, IF WE DON'T GIVE IT THEN ALSO IT WILL WORK
*/
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//FOR ALL THE PUBLIC FILES LIKE PDFs , IMAGES
app.use(express.static("public"))
app.use(cookieParser())
export {app};



//THE USE OF COOKIE PARSER IS TO ACCESS USER BROWSER COOKIES AND SET COOKIES IN THEIR BROWSER 
//SO THAT WE CAN APPLY CRUD OPERATIONS ON IT

//THESE COOKIES CAN BE STORED VERY SECURELY IN WHICH ONLY SERVER CAN READ AND ACCESS THOSE COOKIES
//WHICH IS A GOOD METHOD