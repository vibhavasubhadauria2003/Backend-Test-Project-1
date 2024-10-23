import mongoose,{Schema} from "mongoose";

const videoSchema=new Schema(
    {
        videoFile:{
            type:String,   //cloudinary url
            required:true
        },
        thumbnail:{
            type:String,   //cloudinary url
            required:true
        },
        title:{
            type:String,   
            required:true
        },
        discription:{
            type:String,  
            required:true
        },
        duration:{
            type:Number,  
            required:true
        },
        views:{
            type:Number, 
            required:true,
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"   
        }
    },
    {
        timestamps:true
    }
)

export const Video = mongoose.model("Video",videoSchema);