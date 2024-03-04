const expressAsyncHandler = require("express-async-handler");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const uniqid = require('uniqid')



const createCart = expressAsyncHandler(async(req,res)=>{
    const {cart} = req.body
    const {_id} = req.user
    try{
        let products = []
        const cartAlreadyExist = await cartModel.findOne({orderBy:_id})
        if(!cartAlreadyExist){
            for(let i=0; i<cart.length; i++){
                let object = {}
                object.product=cart[i]._id;
                object.count=cart[i].count;
                let getPrice = await productModel.findById(cart[i]._id).select("price").exec();

                object.price=getPrice.price;
                products.push(object)
            }
            console.log(products)
            let newCart = await cartModel.create({
                products,
                orderBy:_id

            })
            const carttotalsum = await cartModel.findOne({orderBy:_id})
            const tosum = await carttotalsum.reSaveTotalCart()
            carttotalsum.save()
            res.json(carttotalsum)
            
        }else{
            console.log(cart[0]._id.toString())
            const itemIncart = cartAlreadyExist.products.find(item=>item.product.toString() === cart[0]._id.toString())
            console.log(itemIncart)
            if(itemIncart){
                for(let i=0; i<cart.length; i++){
                    let object = {}
                    object.product=cart[i]._id;
                    object.count=cart[i].count;
                    let getPrice = await productModel.findById(cart[i]._id).select("price").exec();
    
                    object.price=getPrice.price;
                    products.push(object)
                }
                console.log(products)
                let cartUpdate = await cartModel.updateOne({
                    products:{$elemMatch:itemIncart}
                },{
                    $inc:{"products.$.count" : products[0].count,  
                 },
                 $set:{"products.$.price":products[0].price }
                })
                const carttotalsum = await cartModel.findOne({orderBy:_id})
                const tosum = await carttotalsum.reSaveTotalCart()
                carttotalsum.save()
                
                res.json(carttotalsum)
            }else{
                for(let i=0; i<cart.length; i++){
                    let object = {}
                    object.product=cart[i]._id;
                    object.count=cart[i].count;
                    let getPrice = await productModel.findById(cart[i]._id).select("price").exec();
    
                    object.price=getPrice.price;
                    console.log(object)
                    products.push(object)
                }
                console.log(products)
                let cartUpdate = await cartModel.findOneAndUpdate({orderBy:_id},{
                    $push : {products:products}
                })
                const carttotalsum = await cartModel.findOne({orderBy:_id})
                const tosum = await carttotalsum.reSaveTotalCart()
                carttotalsum.save()
                
                res.json(carttotalsum)
            }
        }

    }catch(err){
        res.status(400).json(err.message)
    }

})

const createOrder = expressAsyncHandler(async(req,res)=>{
    const {COD} = req.body
    const userId = req.user._id
    if(!COD) return res.status(400).json({msg:"error in creating"})
    try{
        const userCart = await cartModel.findOne({orderBy:userId})
        let newOrder = await new orderModel({
            products:userCart.products,
            paymentIntent:{
                id: uniqid(),
                method:"COD",
                amount:userCart.cartTotal,
                status:"Cash on Delivery",
                created:Date.now(),
                currency:"usd"
            },
            orderBy:userId,
            orderStatus:"Cash on Delivery"
        }).save()
        let update = userCart.products.map((item)=>{
            return{
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity:-item.count,sold:+ item.count}}
                }
            }
        })
        const updated = productModel.bulkWrite(update,{})
        res.json({msg:"successful"})
    }catch(err){
        res.status(500).json(err.message)
    }

})

module.exports = {createCart,createOrder}