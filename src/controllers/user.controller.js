import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
const generateAccessandRefreshToken=async (userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave: false})//validateBeforeSave: false it is done to avoid validating other attributes while saving in DB
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Access and Refresh Token")
    }
}
const registerUser=asyncHandler(async(req,res)=>{
    const {username,fullName,email,password} = req.body;
    if(username===""||fullName===""||email===""||password==="")
    {
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=await User.findOne({$and: [{username},{email}]});
    if(existedUser){
        throw new ApiError(409,"User allready exists");
    }
    const avtarPath=req.files?.avtar[0]?.path;
    const coverImagePath=req.files?.coverImage[0]?.path;
    if(!avtarPath){
        throw new ApiError(400,"Avtar Image file is required");
    }
    const avtar= await uploadOnCloudinary(avtarPath);
    const coverImage= await uploadOnCloudinary(coverImagePath);
    if(!avtar){
        throw new ApiError(400,"Cloudinary Profile Image link is unavilable");
    }
    const user=await User.create({
        username:username.toLowerCase(),
        fullName,
        avtar:avtar.url,
        coverImage:coverImage.url,
        email,
        password
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new ApiError(500,"Error while registering on DB");
    }
    console.log(createdUser)
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User Created on DB")
    )
})
const loginUser=asyncHandler(async(req,res)=>{
    const {email,username,password}=res.body;
    if(!email && !username){
        throw new ApiError(400,"username or email is required");
    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Password incorrect")
    }
    const {accessToken,refreshToken} = await generateAccessandRefreshToken(user._id);
    const updatedUser=await User.findById(user._id).select(
        "-password -refreshToken"
    );
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user:updatedUser,accessToken,refreshToken
            },
            "user loggin successfully"
        )
    )
 })
const logoutUser=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,
            {},
            "user logged out successfully"
        )
    )
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies?.refreshToken
    if(!incomingRefreshToken)
    {
        throw new ApiError(401,"Unauthorized Request")
    }
    try {
        const decordedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decordedToken._id)
        if(!user){
    
            throw new ApiError(401,"Invalid refresh token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"Refresh Token expired")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken,newRefreshToken}=await generateAccessandRefreshToken(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshTokenefreshToken,options)
        .json(
            new ApiResponse(200,
                {
                    accessToken,refreshToken:newRefreshToken
                },
                "access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,"Invalid refresh token")
    }
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};