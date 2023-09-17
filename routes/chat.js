const express = require('express')
const router = express.Router()
const chatController = require('../controllers/chatController')
const verify = require('./verify/verify')


router.use(verify)
router.get('/' , chatController.getAllChat.bind(chatController))
router.get('/page/:id' , chatController.getOneChat.bind(chatController))
router.post('/create' , chatController.createChat.bind(chatController))

module.exports = router