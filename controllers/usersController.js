const Controller = require("./controller");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const sult = 10;

module.exports = new (class UsersController extends Controller {
  async getAllUsers(req, res, next) {
    try {
      const randomNumber = Math.round(Math.random() * 10);
      let searchedUsers = await User.find(
        req.query.username
          ? {
              username: { $regex: req.query.username.toLowerCase() },
            }
          : {}
      )
        .sort({ createdAt: -1 })
        .skip(req.query.showmore ? randomNumber : 0)
        .limit(req.query.showmore ? 4 : 0)
        .select(
          "-__v -updatedAt -createdAt -password -following -followers -bio"
        );
      res.status(200).json(searchedUsers);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req, res, next) {
    try {
      let user = await User.findOne({ _id: req.params.userId }).select(
        "-__v -updatedAt -password"
      );
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message: "No user found with this id",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getAllFollowers(req, res, next) {
    try {
      let user = await User.findOne({ _id: req.params.userId }).populate(
        "followers",
        "-__v -updatedAt -createdAt -password -following -followers"
      );
      if (user) {
        res.status(200).json(user.followers);
      } else {
        res.status(404).json({
          message: "No user found with this id",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async getAllFollowing(req, res, next) {
    try {
      let user = await User.findOne({ _id: req.params.userId }).populate(
        "following",
        "-__v -updatedAt -createdAt -password -following -followers"
      );
      if (user) {
        res.status(200).json(user.following);
      } else {
        res.status(404).json({
          message: "No user found with this id",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async followHandler(req, res, next) {
    try {
      let user = await User.findById(req.body.userId);
      let loginUser = await User.findById(req.userData._id);
      if (
        user &&
        loginUser &&
        !user.followers.includes(req.userData._id) &&
        !loginUser.following.includes(req.body.userId)
      ) {
        User.updateOne(
          { _id: req.body.userId },
          { $push: { followers: req.userData._id } }
        ).then((result) => {
          User.updateOne(
            { _id: req.userData._id },
            { $push: { following: user._id } }
          ).then((finalResult) => {
            res.status(200).json({
              message:
                "The desired user has been successfully added to the list of following",
              success: true,
            });
          });
        });
      } else {
        res.status(400).json({
          message: "The user is already in the following list",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async unFollowHandler(req, res, next) {
    try {
      let user = await User.findById(req.body.userId);
      let loginUser = await User.findById(req.userData._id);
      if (
        user &&
        loginUser &&
        user.followers.includes(req.userData._id) &&
        loginUser.following.includes(req.body.userId)
      ) {
        User.updateOne(
          { _id: req.body.userId },
          { $pull: { followers: req.userData._id } }
        ).then((result) => {
          User.updateOne(
            { _id: req.userData._id },
            { $pull: { following: user._id } }
          ).then((finalResult) => {
            res.status(200).json({
              message: "The intended user was successfully unfollowed",
              success: true,
            });
          });
        });
      } else {
        res.status(400).json({
          message: "Do not include the desired user in the following list",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async changePass(req, res, next) {
    try {
      let user = await User.findById(req.userData._id);
      if (user) {
        if (await bcrypt.compare(req.body.oldPassword, user.password)) {
          User.updateOne(
            { _id: user._id },
            { $set: { password: bcrypt.hashSync(req.body.newPassword, sult) } }
          ).then((result) => {
            res.status(200).json({
              message: "change password success",
              success: true,
            });
          });
        } else {
          res.status(200).json({
            message: "oldpassword is wrong",
            success: false,
          });
        }
      } else {
        res.status(400).json({
          message: "User Not Found",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req, res, next) {
    try {
      let user = await User.findById(req.userData._id);
      if (user) {
        User.updateOne(
          { _id: user._id },
          {
            $set: {
              avatar:
                req.file !== undefined
                  ? req.file.path.replace(/\\/g, "/").substring(6)
                  : req.body.deleteAvatar == 1
                  ? null
                  : user.avatar,
              name: req.body.name,
              bio: req.body.bio,
            },
          }
        ).then((result) => {
          res.status(200).json({
            message: "profile change is success",
            success: true,
            profile: {
              name: req.body.name,
              avatar:
                req.file !== undefined
                  ? req.file.path.replace(/\\/g, "/").substring(6)
                  : req.body.deleteAvatar == 1
                  ? null
                  : user.avatar,
            },
          });
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();
