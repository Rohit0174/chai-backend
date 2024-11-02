import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandler(async (req, res) => {
  /*
 1. get user details from frontend
 2. validations - not empty
 3. check if user already exists : username and email
 4. check for images
 5. check for avatar
 6. upload them to cloudinary , check avatar on cloudinary and whether multer stored it in local storage
 7. Create user object - for mongoDB - then create entry in DB
 8. Remove password and refresh token from response (we don't want to send it back to client).
 9. Check for user creation 
 10. return res.
 */

  const { fullName, email, password, userName } = req.body; //THIS WILL ONLY HANDLE JSON DATA TO HANDLE FILE DATA WE NEED TO ADD MULTER MIDDLEWARE IN ROUTES
  if (
    [fullName, email, password, userName].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  //we can add other validations also, like checking email validation etc...

  //NOW CHECKING WHETHER USER ALREADY EXISTS
  const existedUser = await User.findOne({
    $or: [{ userName }, { email }], //if any of the value exists in DB
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or user name already exists");
  }

  //MULTER GIVES US ACCESS TO REQ.FILES
  /*
  Multer gives us access to path , because multer stores files on local server.
  */
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) throw new ApiError(400, "Avatar required");

  //upload on cloudinary server
  const avatar = await uploadOnCloudinary(avatarLocalPath); //THIS WILL DEFINETELY WILL TAKE TIME TO UPLOAD, IMAGE/VIDEO
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) throw new ApiError(400, "Avatar required");

  //DB ENTRY
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //ADDING CHECK WHETER USER IS CREATED OR NOT AND REMOVING PASSWORD AND REFRESH TOKEN FROM RESPONSE

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  //RETURN RES
  return res.status(201).json(
    //we can handle this status code inside APIRESPONSE but postman thinks and shows status on the basis of this .status with res
    new ApiResponse(200, createdUser, "User created successfully")
  );
});
export { registerUser };
