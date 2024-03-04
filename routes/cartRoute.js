const express = require('express')
const { authMiddleware } = require('../middlewares/authmiddleare')
const { createCart, createOrder } = require('../controller/cartCtrl')
const router = express.Router()


router.post('/create-cart',authMiddleware,createCart)
router.post('/create-order',authMiddleware,createOrder)

module.exports = router