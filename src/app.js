import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app=express()

app.use(cors({
    origin:process.env.CORS_LINK
}))
app.use(express.static("public"))
app.use(cookieParser())
//import router
import userRouter from "./routes/user.routes.js";
//using user router
app.use("/users",userRouter)
export { app }