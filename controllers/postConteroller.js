const Controller = require("./controller");
const Post = require("../model/post");
const Comment = require("../model/comment");

module.exports = new (class PostController extends Controller {
  async getAllPosts(req, res, next) {
    try {
      const pageSize = 10;
      let posts = await Post.find({})
        .sort({ createdAt: -1 })
        .skip(req.query.page ? pageSize * req.query.page - pageSize : 0)
        .limit(req.query.page ? pageSize : 0)
        .select("-createdAt -__v")
        .populate("author", "-password -createdAt -updatedAt -__v");
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  async getOnePost(req, res, next) {
    try {
      let post = await Post.findOne({ _id: req.params.postId })
        .select("-createdAt -__v")
        .populate("author", "-password -createdAt -updatedAt -__v");
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "There is no post with this id",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllPostUser(req, res, next) {
    try {
      const pageSize = 10;
      let posts = await Post.find({ author: req.params.userId })
        .sort({ createdAt: -1 })
        .skip(req.query.page ? pageSize * req.query.page - pageSize : 0)
        .limit(req.query.page ? pageSize : 0)
        .select("-createdAt -__v")
        .populate("author", "-password -createdAt -updatedAt -__v");
      if (posts) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({
          message: "There is no post with this userId and postId",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async createPost(req, res, next) {
    try {
      let newPost = new Post({
        textBody: req.body.textBody,
        author: req.userData._id,
        image: req.file ? req.file.path.replace(/\\/g, "/").substring(6) : null,
      });
      newPost.save().then((result) => {
        res.status(200).json({
          message: "New post successfully created",
          success: true,
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async likePost(req, res, next) {
    try {
      let post = await Post.findById(req.body.postId);
      if (!post.likes.includes(req.userData._id)) {
        Post.updateOne(
          { _id: req.body.postId },
          { $push: { likes: req.userData._id } }
        ).then((result) => {
          res.status(200).json({
            message: "The post was liked",
            success: true,
          });
        });
      } else {
        res.status(400).json({
          message: "This post has already been liked by you",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async getPostLikes(req, res, next) {
    try {
      let post = await Post.findOne({ _id: req.params.postId });
      if (post) {
        res.status(200).json(post.likes);
      } else {
        res.status(404).json({
          message: "No post was found with this ID",
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async disLike(req, res, next) {
    try {
      Post.updateOne(
        { _id: req.body.postId },
        { $pull: { likes: req.userData._id } }
      ).then((result) => {
        res.status(200).json({
          message: "The post was disliked",
          success: true,
        });
      });
    } catch (error) {
      next(error);
    }
  }

  async getComment(req, res, next) {
    try {
      let comments = await Comment.find({ postId: req.params.postId })
        .sort({ createdAt: -1 })
        .select("-postId -__v")
        .populate(
          "authorId",
          "-password -createdAt -updatedAt -__v -followers -following "
        );
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }
  async createComment(req, res, next) {
    try {
      let post = await Post.findById(req.body.postId);
      console.log(req.userData.id);
      if (post) {
        let newComment = new Comment({
          postId: post._id,
          authorId: req.userData._id,
          text: req.body.text,
        });
        newComment.save().then((result) => {
          res.status(200).json({
            message: "The comment was successfully registered",
            success: true,
          });
        });
      } else {
        res.status(400).json({
          message: "There was an error registering the comment",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();
