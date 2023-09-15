const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')

router.post('/create' , chatController.createChat.bind(chatController))

module.exports = router