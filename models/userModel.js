const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt")
const crypto = require('crypto')

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        
    },
    lastname:{
        type:String,
        required:true,
        
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    role:{
        admin:{
            type:Number
        },
        user:{
            type:Number,
            default:100
        },
        editor:{
            type:Number,
        }
    },
    password:{
        type:String,
        required:true,
    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    refreshtoken:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    cart:[],
    address:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
        }
    ],
    wishlist:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }
    ],
    
    
},
{
    timestamps:true
});

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hash(this.password,salt)
    }
    next()
})

userSchema.methods.isPasswordMatch = async function(enterPassword){
    return await bcrypt.compare(enterPassword,this.password)
}
userSchema.methods.createPasswordResetToken = async function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires =Date.now() + 10 * 60 * 1000;
    return resetToken
}
//Export the model
module.exports = mongoose.model('User', userSchema);
