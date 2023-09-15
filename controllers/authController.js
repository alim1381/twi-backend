const Controller = require("./controller");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sult = 10;

module.exports = new (class authController extends Controller {
  async loginUser(req, res, next) {
    // inputs = {username , password}
    try {
      let user = await User.findOne({ username: req.body.username });
      if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
          jwt.sign(
            { user },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
            async (err, token) => {
              User.updateOne(
                { username: user.username },
                { $set: { token: token } }
              ).then((result) => {
                res.status(200).json({
                  id: user._id,
                  name: user.name,
                  username: user.username,
                  token: token,
                });
              });
            }
          );
        } else {
          res.status(400).json({
            message: "No user found with this username",
            success: false,
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  async registerUser(req, res, next) {
    // inputs : {username , password}{name}
    try {
      let userValid = await User.findOne({ username: req.body.username });
      if (userValid) {
        res.status(404).json({
          message: "There is another user with this username",
          success: false,
        });
      } else {
        let newUser = new User({
          username: req.body.username,
          name: req.body.name || "",
          password: bcrypt.hashSync(req.body.password, sult),
          token: req.body.username,
        });
        newUser.save().then((result) => {
          jwt.sign(
            { newUser },
            process.env.SECRET_KEY,
            { expiresIn: "1h" },
            async (err, token) => {
              User.updateOne(
                { username: result.username },
                { $set: { token: token } }
              ).then(async (updateResult) => {
                let newU = await User.findOne({ username: result.username });
                res.status(200).json({
                  id: newU._id,
                  username: newU.username,
                  name: newU.name,
                  token: newU.token,
                });
              });
            }
          );
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();
