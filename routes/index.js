const express = require("express");
const router = express.Router();
const Post = require("../model/post");
const User = require("../model/user");

router.get("/", async (req, res) => {
  let posts = await Post.find({}).populate("author");
  res.status(200).json({
    posts,
  });
});

module.exports = router;
