const express = require('express')
const { createProduct, getProduct, ratingProduct, uploadImages } = require('../controller/productCtrl')
const { authMiddleware } = require('../middlewares/authmiddleare')
const { uploadPhoto, producIgResize } = require('../middlewares/uploadimages')
const router = express.Router()


router.post('/create', createProduct)
router.post('/rate',authMiddleware, ratingProduct)
router.put('/upload/:id',authMiddleware,uploadPhoto.array('images',10),producIgResize,uploadImages)
router.get('/all',authMiddleware, getProduct)

module.exports = router