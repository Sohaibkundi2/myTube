import {asyncHandler} from '../utils/asyncHandler.js'
import ApiError from './../utils/ApiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary}  from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponce.js'


const registerUser = asyncHandler(async (req, res)=>{
    
    const {username, fullName, email, password} = req.body

    //validatiom

    if([username, fullName, email, password].some((field)=> field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }

    const existUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existUser){
        throw new ApiError(409,"User with username or email is already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverLocalPath = req.files?.coverImage?.[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    let coverImage = ""
    if(coverLocalPath){
        coverImage = await uploadOnCloudinary(coverLocalPath);
    }

    const user = new User({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar?.url,
    coverImage: coverImage?.url || ""
    });
    user.refreshToken = user.generateRefreshToken();
    await user.save(); 

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"something went wrong while creating user")
    }

    res
    .status(201)
    .json(new ApiResponse(201, createdUser, "user created successfully"))


})





export {
    registerUser
}