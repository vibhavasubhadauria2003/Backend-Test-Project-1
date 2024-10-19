import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app=express()

use(cors({
    origin:process.env.CORS_LINK
}))


export { app }