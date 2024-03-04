const express = require("express")
const { registerCtrl, loginCtrl, getUsers, get_a_user, delete_a_user, update_a_user, handleRefreshtoken, forgetPassword, resetPass } = require("../controller/userCtrl")
const { authMiddleware, verifyRole } = require("../middlewares/authmiddleare")
const router = express.Router()


router.post('/register',registerCtrl)
router.post('/login',loginCtrl)
router.post('/forget-password',forgetPassword)
router.post('/reset-pass/:token',resetPass)
router.get('/refreshtoken',handleRefreshtoken)
router.get('/allusers',authMiddleware,verifyRole(200),getUsers)
router.get('/:id', authMiddleware,verifyRole(200),get_a_user)
router.delete('/:id',authMiddleware,verifyRole(200),delete_a_user)
router.put('/',authMiddleware,verifyRole(200),update_a_user)

module.exports = router