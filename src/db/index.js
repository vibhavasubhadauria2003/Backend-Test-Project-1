import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"


const connectDB=async ()=>{
    try{
        const connectInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nMongoDB Connected: ${connectInstance}`)
    }
    catch(error){
        console.error("Error:",error);
        process.exit(1)
    }
}
export default connectDB;