const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get("/", chatController.getAllChat.bind(chatController));
router.get("/page/:id", chatController.getOneChat.bind(chatController));
router.post("/lastmessage", chatController.getLastMassege.bind(chatController));
router.post("/create", chatController.createChat.bind(chatController));

module.exports = router;
