const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const authMiddleware = asyncHandler(async (req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token,process.env.JWT_TOEN,async(err,decoded)=>{
        if(err) return res.status(401).json({msg:"token has expired"})
        const getUser = await User.findById(decoded?.id) 
        req.user = getUser
        req.roles = Object.values(getUser.role)
        next()
        });
        
        
        
    }else{
        return res.status(401).json({msg:"there is no token"})
    }
})

const verifyRole = (...rolelist)=>{
    
    return (req,res,next)=>{
        const rolelisted = [...rolelist]
        const checkRole = req.roles.map(val=> rolelisted.includes(val)).find(val=> val===true)
        if(!checkRole) return res.status(401).json({msg:"not authorised"})
        next()
    }
}

module.exports = {authMiddleware,verifyRole}