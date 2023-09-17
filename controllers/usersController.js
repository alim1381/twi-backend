const Controller = require("./controller");
const User = require("../model/user");

module.exports = new (class UsersController extends Controller {
  async getAllUsers(req, res, next) {
    try {
      let searchedUsers = await User.find(
        req.query.username
          ? {
              username: { $regex: req.query.username },
            }
          : {}
      ).select('-__v -updatedAt -createdAt -password')
      res.status(200).json(searchedUsers);
    } catch (error) {
      next(error);
    }
  }

  async getOneUser(req, res, next) {
    try {
      let user = await User.findOne({_id : req.params.userId}).select('-__v -updatedAt -password')
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          message : "No user found with this id",
          success : false
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();
