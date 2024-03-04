const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,ref:"Product"
            },
            count:Number,
            price:Number
        }
    ],
    cartTotal:Number,
    totalAfterDiscount:Number,

    orderBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

// cartSchema.pre('save', async function(next){
//     let totalAmount = 0
//     console.log(this.products)
//     for(let prod of this.products){
//         totalAmount = totalAmount + (prod.price * prod.count)
//     }
//     this.cartTotal = totalAmount
//     next()
// })
cartSchema.methods.reSaveTotalCart = async function(){
    let totalAmount = 0
    
    for(let prod of this.products){
        totalAmount = totalAmount + (prod.price * prod.count)
    }
    this.cartTotal = totalAmount
}

//Export the model
module.exports = mongoose.model('Cart', cartSchema);