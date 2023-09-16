const express = require("express");
const postConteroller = require("../controllers/postConteroller");
const router = express.Router();

router.get("/page/:page", postConteroller.getAllPosts.bind(postConteroller));

module.exports = router;
