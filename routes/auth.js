const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const uploadUserImage = require('../upload/uploadUserImage')

router.post('/login' , authController.loginUser.bind(authController))
router.post('/register' , uploadUserImage.single('avatar') , authController.registerUser.bind(authController))

router.get('/verifytoken' ,authController.verifyToken.bind(authController))

router.get('/refreshtoken' ,authController.refreshToken.bind(authController))

module.exports = router