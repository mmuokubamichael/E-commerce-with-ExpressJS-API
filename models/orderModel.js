const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,ref:"Product"
            },
            count:Number,
            price:Number
        }
    ],
    paymentIntent:{},
    orderStatus:{
        type:String,
        default:"Not Processed",
        enum:["Not Processed","Cash on Delivery","Processing","Dispatched","Canceled"]
    },
    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

    
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);