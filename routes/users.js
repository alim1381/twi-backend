const express = require("express");
const usersController = require("../controllers/usersController");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

router.get('/' , usersController.getAllUsers.bind(usersController))
router.get('/:userId' , usersController.getOneUser.bind(usersController))

router.get('/followers/:userId' , usersController.getAllFollowers.bind(usersController))
router.get('/following/:userId' , usersController.getAllFollowing.bind(usersController))

router.post('/follow' , usersController.followHandler.bind(usersController))
router.post('/unfollow' , usersController.unFollowHandler.bind(usersController))

router.post('/changepass' , usersController.changePass.bind(usersController))
router.post('/editProfile' , upload.single('avatar')  , usersController.editProfile.bind(usersController))

module.exports = router;
