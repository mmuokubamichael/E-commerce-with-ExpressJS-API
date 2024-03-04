const asyncHandler = require("express-async-handler")
const { validateMongodbid } = require("../utils/validateDB_ID")
const blogModel = require('../models/blogModel')


const createBlog = asyncHandler(async(req,res)=>{
    try{
        const newBlog = await blogModel.create(req.body)
        res.json(newBlog)
    }catch(err){
        res.status(500).json({msg:err.message})
    }
})
const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbid(id)
    try{
        const getBlog = await blogModel.findById(id)
        await blogModel.findByIdAndUpdate(id,{
            $inc: {numViews:1},
        },
        {
            new:true
        })
        res.json(getBlog)
    }catch(err){
        res.status(400).json({msg:err})
    }
})
const likeBlog = asyncHandler(async(req,res)=>{
    const {id} = req.body
    const userId = req?.user?._id
    validateMongodbid(id)
    
    try{
        const getBlog = await blogModel.findById(id)
        if(!getBlog) return res.status(400).json({msg:"no blog found"})
        const hasDisliked = getBlog.disLikes.find(userid => userid.toString()===userId.toString())
        if(hasDisliked){
            await blogModel.findByIdAndUpdate(id,{
                $pull: {disLikes:userId}
            },
            {
                new:true
            }) 
        }
        const hasLiked = getBlog.likes.find(userid => userid.toString()===userId.toString())
        if(hasLiked){
            const blog= await blogModel.findByIdAndUpdate(id,{
                $pull: {likes:userId}
            },
            {
                new:true
            })
            res.json(blog)
        }else{

            const blog= await blogModel.findByIdAndUpdate(id,{
                $push: {likes:userId}
            },
            {
                new:true
            })
            res.json(blog)
        }
        
    }catch(err){
        res.status(400).json({msg:err})
    }
})
const dislikeBlog = asyncHandler(async(req,res)=>{
    const {id} = req.body
    const userId = req?.user?._id
    validateMongodbid(id)
    
    try{
        const getBlog = await blogModel.findById(id)
        if(!getBlog) return res.status(400).json({msg:"no blog found"})
        const liked = getBlog.likes.find(userid => userid.toString()===userId.toString())
        if(liked){
            const likedremove=await blogModel.findByIdAndUpdate(id,{
                $pull: {likes:userId}
            },
            {
                new:true
            })
            
        }
        const hasdisLiked = getBlog.disLikes.find(userid => userid.toString()===userId.toString())
        if(hasdisLiked){
            const blog= await blogModel.findByIdAndUpdate(id,{
                $pull: {disLikes:userId}
            },
            {
                new:true
            })
            const getBlog = await blogModel.findById(id).populate("disLikes").populate("likes")
            res.json(getBlog)
        }else{

            const blog= await blogModel.findByIdAndUpdate(id,{
                $push: {disLikes:userId}
            },
            {
                new:true
            })
            const getBlog = await blogModel.findById(id).populate("disLikes").populate("likes")
            res.json(getBlog)
        }
        
    }catch(err){
        console.log(err)
        res.status(400).json({msg:err})
    }
})

module.exports = {createBlog,getBlog,likeBlog,dislikeBlog}