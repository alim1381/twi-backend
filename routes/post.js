const express = require("express");
const postConteroller = require("../controllers/postConteroller");
const router = express.Router();

router.get("/", postConteroller.getAllPosts.bind(postConteroller));
router.get("/:userId/:postId", postConteroller.getOnePost.bind(postConteroller));
router.get("/:userId", postConteroller.getAllPostUser.bind(postConteroller));
router.post("/create", postConteroller.createPost.bind(postConteroller));

module.exports = router;
