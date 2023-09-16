const Controller = require("./controller");
const Post = require("../model/post");

module.exports = new (class PostController extends Controller {
  async getAllPosts(req, res, next) {
    try {
      const pageSize = 10;
      let posts = await Post.find({})
        .sort({ createAt: -1 })
        .skip(pageSize * req.params.page - pageSize)
        .limit(pageSize)
        .select('-createdAt -__v')
        .populate("author", "-password -createdAt -updatedAt -__v");
        res.status(200).json({
            posts
        })
    } catch (error) {
      next(error);
    }
  }
})();
