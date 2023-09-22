const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();

router.get('/' , usersController.getAllUsers.bind(usersController))
router.get('/:userId' , usersController.getOneUser.bind(usersController))

router.get('/followers/:userId' , usersController.getAllFollowers.bind(usersController))
router.get('/following/:userId' , usersController.getAllFollowing.bind(usersController))

router.post('/follow' , usersController.followHandler.bind(usersController))
router.post('/unfollow' , usersController.unFollowHandler.bind(usersController))

module.exports = router;
