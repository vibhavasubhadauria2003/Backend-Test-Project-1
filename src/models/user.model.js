// import { type } from "express/lib/response";
import mongoose, {Schema} from "mongoose";

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avtar:{
        type:String, //cloudinary url
        required:true,
    },
})

export const User = mongoose.model("User",userSchema);