const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/login' , authController.loginUser.bind(authController))
router.post('/register' , upload.single('avatar') , authController.registerUser.bind(authController))

router.get('/verifytoken' ,authController.verifyToken.bind(authController))

router.get('/refreshtoken' ,authController.refreshToken.bind(authController))

module.exports = router