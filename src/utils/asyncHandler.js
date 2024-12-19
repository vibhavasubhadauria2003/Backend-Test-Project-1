const asyncHandler= (requestHandler)=> async (req,res,next)=>{
    try {
        await requestHandler(req,res,next)
    } catch (error) {
        res.status(err.code||500).json({
            sucses:false,
            message:err.message
        })
    }
}

export {asyncHandler} 