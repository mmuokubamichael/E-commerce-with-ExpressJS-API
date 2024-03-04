const { generateToken } = require('../configs/jsonwebtoken')
const userModel = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const { validateMongodbid } = require('../utils/validateDB_ID')
const { generateRefreshToken } = require('../configs/refreshJWT')
const jwt = require("jsonwebtoken")
const { sendEmail } = require('./emailCtrl')
const crypto = require("crypto")
const { hash } = require('bcrypt')


const registerCtrl = asyncHandler(async(req,res)=>{
    
    console.log(req.body)
    const email = req.body.email
    const findUser = await userModel.findOne({email})
    if(!findUser){
        const newUser =await userModel.create(req.body);
        res.json(newUser)
    }else{
        res.json({msg: 'User already exist',
        success:false
    })
    }
} )

const loginCtrl = asyncHandler(async (req,res)=>{
    const {email,password} = req.body
    const findUser = await userModel.findOne({email})
    
    if(findUser && await findUser.isPasswordMatch(password)){
        const refreshtoken = await generateRefreshToken(findUser._id)
        findUser.refreshtoken = refreshtoken
        findUser.save()
        res.cookie('refreshToken',refreshtoken,{
            httpOnly: true,
            maxAge: 3*24*60*60*1000
        })
        res.status(200).json({
            id:findUser?.id,
            firstname:findUser?.firstname,
            lastname:findUser?.lastname,
            accessToken:generateToken(findUser.id)
        })
    }else{
        res.status(400).json({message:"credential not valid"})
    }

})

const getUsers = asyncHandler(async (req,res)=>{
    try{
        const allUsers = await userModel.find()
        res.json(allUsers)
    }catch(err){
        throw new Error(err)
    }
})

const get_a_user = asyncHandler(async (req,res)=>{
    console.log(req.params)
    const {id} = req.params
    validateMongodbid(id)
    try{
        const user = await userModel.findById(id)
        res.json(user)
    }catch(err){
        res.status(400).json({"message":"not found"})
    }
})
const delete_a_user = asyncHandler(async (req,res)=>{
    console.log(req.params)
    const {id} = req.params
    try{
        const user = await userModel.findByIdAndDelete(id)
        res.json(user)
    }catch(err){
        res.status(400).json({"message":"not found"})
    }
})
const update_a_user = asyncHandler(async (req,res)=>{
    console.log(req.body)
    const {_id} = req.user
    validateMongodbid(_id)
    try{
        const user = await userModel.findByIdAndUpdate(_id,
            {
            firstname:req.body?.firstname,
            lastname:req.body?.lastname,
            mobile:req.body?.mobile,
            },
            {
                new:true,
            })
        res.json(user)
    }catch(err){
        res.status(400).json({"message":"not found"})
    }
})

const handleRefreshtoken = asyncHandler(async (req,res)=>{
    const cookies= req.cookies;
    console.log("cookies")
    if(!cookies?.refreshToken) return res.status(401).json({msg:"no refreshToken found"})
    const refToken = cookies?.refreshToken
    const user = await userModel.findOne({refreshtoken:refToken})
    if(!user) return res.status(401).json({msg:"no user found with this token"})
    jwt.verify(
        refToken,
        process.env.JWT_TOEN,
        (err, decode) => {
            if (err) return res.sendStatus(403);
            const newAccesstoken = generateToken(user._id)
            res.json(newAccesstoken)
            
        }
    )

    

})

const forgetPassword = asyncHandler(async (req,res)=>{
    const {email} = req.body;
    const findUser = await userModel.findOne({email})

    if(!findUser) return res.status(400).json({msg:"no user with the email"})
    const token = await findUser.createPasswordResetToken()
    await findUser.save()
    const data= {
        to:email,
        subject:"forget passwrd link",
        text:'hey user',
        htm: `follow this link to reset your password. is valid for 10mins from now <a href='localhost:5000/api/user/reset-pass/${token}'`
    }
    try{
        sendEmail(data)
        res.json(token)
    }catch(err){
        res.status(500).json({msg:err})
    }
    

})

const resetPass = asyncHandler(async (req,res)=>{
    const {token} = req.params
    const {password} = req.body
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const findUser = await userModel.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires:{"$gt" : Date.now()},
    })
    if(!findUser) return res.status(400).json({msg:"token has expired/error in token"})
    findUser.password = password
    findUser.passwordResetToken = undefined
    findUser.passwordResetExpires = undefined
    findUser.save()
    res.json(findUser)

})

module.exports = {registerCtrl,loginCtrl,getUsers,get_a_user,delete_a_user,update_a_user,handleRefreshtoken,forgetPassword,resetPass};