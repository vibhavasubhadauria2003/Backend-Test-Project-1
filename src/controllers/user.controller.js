import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser=asyncHandler(async(req,res)=>{
    const {username,fullName,email,password} = req.body
})

export {registerUser};