const productModel = require('../models/productModel')
const asyncHandler = require('express-async-handler')
const { validateMongodbid } = require('../utils/validateDB_ID')
const { cloudinaryUpload } = require('../utils/cloudinary')
const fs = require('fs')
//const slugify = require('slugify')

const createProduct = asyncHandler(async (req,res)=>{
    console.log("working!!!!!!!!!!!")
    console.log(req.body)
    
    // if(req.body.title){
    //     req.body.slug = slugify(req.body.title)
    // }
    try{
        const newProduct =await productModel.create(req.body)
        res.json(newProduct)
    }catch(err){
        res.status(400).json({msg:err?.message})
    }

})
const getProduct = asyncHandler(async (req,res)=>{
    const queryOBJ = {...req.query}
    // filtering
    const excludeField = ["page","sort","limit","fields"];
    excludeField.forEach( el=> delete queryOBJ[el])
    console.log(req.query,queryOBJ) 
    let queryStr = JSON.stringify(queryOBJ)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match)=>`$${match}`)
    console.log(JSON.parse(queryStr))

    
    
    try{
        let newProduct = productModel.find(JSON.parse(queryStr))
        // sorting
        if (req.query.sort){
            let sortBy = req.query.sort.split(",").join(" ")
            newProduct = newProduct.sort(sortBy)
        }else{
            newProduct = newProduct.sort("createdAt")
        }
        // select by fields
        if (req.query.fields){
            let fields = req.query.fields.split(",").join(" ")
            newProduct = newProduct.select(fields)
        }else{
            newProduct = newProduct.select("-__v")
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        if(req.query.page && req.query.limit){
            
            const productCount =await productModel.countDocuments();
            console.log(skip,productCount)
            if (skip >= productCount){
                return res.status(400).json({msg:"page not found"})
            }
        }
        newProduct = newProduct.skip(skip).limit(limit)

        const product = await newProduct
        res.json(product)
    }catch(err){
        res.status(400).json({msg:err?.message})
    }

})

const ratingProduct = asyncHandler(async(req,res)=>{
    const {rate,prodId} = req.body
    const userId = req?.user?._id
    try{
        const prod = await productModel.findById(prodId)
        if(!prod) return res.status(400).json({msg:"no product with id found"})
        const alreadyRated = prod.ratings.find(item => item.postedBy.toString()===userId.toString())
        if(alreadyRated){
            const updateRating = await productModel.updateOne(
                {
                    ratings:{$elemMatch:alreadyRated},
                },
                {
                    $set:{"ratings.$.star":rate}
                }
            )
            
        }else{
            const updateRating = await productModel.findByIdAndUpdate(prodId,{
                $push:{ratings:{
                    postedBy:userId,
                    star:rate
                }}
            },
            {
                new:true
            })
            
        }
        const product_item = await productModel.findById(prodId)
        const prodRatesLenght = product_item.ratings.length
        const totalRatings = product_item.ratings.map(item=>item.star).reduce((prev,curr)=> prev+curr,0)
        const aveRating = totalRatings/prodRatesLenght
        product_item.totalrating = aveRating
        product_item.save()
        res.json(product_item)
    }catch(err){
        res.status(500).json(err.message)
    }
    
})

const uploadImages = asyncHandler(async(req,res)=>{
    
    const {id} = req.params
    validateMongodbid(id)
    try{
        const uploader =(path)=> cloudinaryUpload(path,'images')
        const urls=[]
        const files = req.files
        for(const file of files){
            const {path} = file
            const newpath = await uploader(path)
            urls.push(newpath)
            fs.unlinkSync(path)
        }
        console.log(urls)
        const product = await productModel.findByIdAndUpdate(id,{
            images: urls.map(url=>{
                return url
            })  
        },{
            new:true
        })
        res.json(product)

    }catch(err){
        res.status(500).json(err.message)
    }
})

module.exports = {createProduct,getProduct,ratingProduct,uploadImages}

