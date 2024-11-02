import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
// router.route("/register").post(registerUser); NORMAL API WITHOUT ADDING OF MIDDLEWARE

//ADDING MIDDLEWARE OF MULTER UPLOAD

/*
1. upload array accepts multiple fileds in a single array.
2. upload fields accepts array.
*/
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
export default router;
