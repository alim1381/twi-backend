const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get('/' , usersController.getAllUsers.bind(usersController))
router.get('/:userId' , usersController.getOneUser.bind(usersController))

module.exports = router;
