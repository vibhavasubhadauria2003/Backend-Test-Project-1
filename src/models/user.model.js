// import { type } from "express/lib/response";
import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcript from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avtar: {
      type: String, //cloudinary url
      required: true,
    },
    coverimage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "vedio",
      },
    ],
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
        type:String
    }
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save",async function(){
  if(this.isModified("password")){
    this.password=bcript.hash(this.password);
  }
  next()
})

userSchema.methods.isPasswordCorrect= async function (password) {
  return await bcript.compare(password,this.password);
}

export const User = mongoose.model("User", userSchema);
