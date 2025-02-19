// require('dotenv').config({path:'./env'});
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
})

connectDB()
.then(()=>{
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.listen(process.env.PORT|| 8000,()=>{
    console.log(`Server is runing at port : ${process.env.PORT}`)
  })
})
.catch((err)=>{
  console.log("DB connection failed",err)
})
