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
})();
