const express = require("express");
const postConteroller = require("../controllers/postConteroller");
const router = express.Router();
const uploadPostImage = require("../upload/uploadPostImage");

router.get("/", postConteroller.getAllPosts.bind(postConteroller));
// router.get("/:userId/:postId", postConteroller.getOnePost.bind(postConteroller));
router.get("/:userId", postConteroller.getAllPostUser.bind(postConteroller));
router.get("/single/:postId", postConteroller.getOnePost.bind(postConteroller));
router.get("/tag/:tag", postConteroller.getTagPosts.bind(postConteroller));

router.post(
  "/create",
  uploadPostImage.single("image"),
  postConteroller.createPost.bind(postConteroller)
);
router.post("/like", postConteroller.likePost.bind(postConteroller));
router.post("/dislike", postConteroller.disLike.bind(postConteroller));
router.get("/like/:postId", postConteroller.getPostLikes.bind(postConteroller));

router.get("/comment/:postId", postConteroller.getComment.bind(postConteroller));
router.post("/comment", postConteroller.createComment.bind(postConteroller));


module.exports = router;
