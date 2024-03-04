const express = require('express')
const { createBlog, getBlog, likeBlog, dislikeBlog } = require('../controller/blogCtrl')
const { authMiddleware } = require('../middlewares/authmiddleare')
const router = express.Router()

router.get('/get/:id',authMiddleware,getBlog)
router.post('/create',authMiddleware,createBlog)
router.post('/like',authMiddleware,likeBlog)
router.post('/dislike',authMiddleware,dislikeBlog)



module.exports = router