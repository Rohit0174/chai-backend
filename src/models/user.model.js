import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // FOR BETTER SEARCHING IN MONGODB DATABASE DON'T THIS IN ALL THE FIELDS
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true, // FOR BETTER SEARCHING IN MONGODB DATABASE
    },
    avatar: {
      type: String, //CLOUDINARY URL WILL BE THERE
      required: true,
    },
    coverImage: {
      type: String, //CLOUDINARY URL WILL BE THERE
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"], //HERE WE CAN PASS CUSTOM ERROR MESSAGE, WE CAN ADD THIS IN ALL REQUIRED OPTIONS
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

/*THIS PRE HOOK IS GIVEN BY MONGOOSE AS A HOOK IN WHICH WE CAN CALL THIS PRE FUNCTION JUST BEFORE THE
EVENT LISTENER IS TRIGGERED
HERE WE ARE CALLING THIS PRE FUNCTION BEFORE SAVE .
WE WILL PASS THE CALLBACK FUNCTION AFTER SAVE BUT DON'T MAKE CB FUNCTION AS AN ARROW FUNCTION 
BECAUSE ARROW FUNCTIONS DON'T HAVE REFERENCE OF THIS KEYWORD AND THIS IS WORKING ON REFERENCE ONLY.
*/
userSchema.pre("save", async function (next) {
  //HERE WE ARE TAKING NEXT , AFTER FUNCTION EXECUTION WE WILL CALL NEXT.
  if (!this.isModified("password")) return next(); //TO UPDATE ONLY WHEN PASSWORD IS CHANGED, IF ONLY FIRSTNAME IS CHANGED THEN ALSO PASSWORD WILL BE GET UPDATED.
  this.password = bcrypt.hash(this.password, 10);
  next();
});

//MAKING CUSTOM HOOK TO CHECK IS PASSWORD.
//MONGOOSE PROVIDES SOME METHODS OF ITS OWN, BUT WE CAN CREATE OF OUR OWN ALSO
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //THIS WILL RETURN A BOOLEAN VALUE
};

userSchema.methods.generateAccessToken = function () {
  //THIS IS A QUICK PROCESS SO WE DIDN'T WRAP IT IN ASYNC AWAIT
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
