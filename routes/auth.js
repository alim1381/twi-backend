const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

router.post('/login' , authController.loginUser.bind(authController))
router.post('/register' , authController.registerUser.bind(authController))

module.exports = router