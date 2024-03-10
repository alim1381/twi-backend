const Controller = require("./controller");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../model/user");
const saveInStorage = require("../firebase/firebase.util");
const sult = 10;

module.exports = new (class authController extends Controller {
  async loginUser(req, res, next) {
    // inputs = {username , password}
    try {
      let user = await User.findOne({ username: req.body.username.toLowerCase()});
      if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
          const refreshToken = await jwt.sign(
            { _id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          // token
          jwt.sign(
            {
              _id: user._id,
              username: user.username,
              name: user.name,
              avatar: user.avatar ? user.avatar : null,
              blueTick: user.blueTick,
            },
            process.env.SECRET_KEY,
            { expiresIn: "30m" },
            async (err, token) => {
              res.status(200).json({
                id: user._id,
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                blueTick: user.blueTick,
                token: token,
                refreshToken: refreshToken,
              });
            }
          );
        } else {
          res.status(404).json({
            message: "This password does not match the username",
            success: false,
          });
        }
      } else {
        res.status(404).json({
          message: "No user found with this username",
          success: false,
        });
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
        const imageUrl = await saveInStorage(req.file);
        let newUser = new User({
          username: req.body.username.toLowerCase(),
          name: req.body.name || "",
          password: bcrypt.hashSync(req.body.password, sult),
          avatar: req.file
            ? imageUrl
            : null,
          bio: "",
        });
        newUser.save().then(async (result) => {
          const refreshToken = await jwt.sign(
            { _id: result._id },
            process.env.SECRET_KEY,
            { expiresIn: "1h" }
          );
          jwt.sign(
            {
              _id: result._id,
              username: result.username,
              name: result.name,
              avatar: result.avatar ? result.avatar : null,
              blueTick: result.blueTick,
            },
            process.env.SECRET_KEY,
            { expiresIn: "30m" },
            (err, token) => {
              res.status(200).json({
                id: result._id,
                username: result.username,
                name: result.name,
                avatar: result.avatar ? result.avatar : null,
                blueTick: result.blueTick,
                following: [],
                followers: [],
                token: token,
                refreshToken: refreshToken,
              });
            }
          );
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyToken(req, res, next) {
    // inputs : {username , password}{name}
    try {
      const bearerHeader = req.headers["authorization"];
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        jwt.verify(token, process.env.SECRET_KEY, async (err, authData) => {
          if (err) {
            res.status(403).json({
              message: "Your token has expired",
              success: false,
            });
          } else {
            setTimeout(() => {
              res.status(200).json({
                id: authData._id,
                name: authData.name,
                username: authData.username,
                avatar: authData.avatar ? authData.avatar : null,
                blueTick: authData.blueTick,
                token: token,
              });
            }, 2000);
          }
        });
      } else {
        res.status(403).json({
          message: "Token is not found",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    // inputs : {username , password}{name}
    try {
      const bearerHeader = req.headers["refresh"];
      if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const refreshToken = bearer[1];
        jwt.verify(
          refreshToken,
          process.env.SECRET_KEY,
          async (err, authData) => {
            if (err) {
              res.status(403).json({
                message: "Your token has expired",
                success: false,
              });
            } else {
              let user = await User.findOne({ _id: authData._id });
              if (user) {
                const refreshToken = await jwt.sign(
                  { _id: user._id },
                  process.env.SECRET_KEY,
                  { expiresIn: "1h" }
                );
                jwt.sign(
                  {
                    _id: user._id,
                    username: user.username,
                    name: user.name,
                    avatar: user.avatar ? user.avatar : null,
                    blueTick: user.blueTick,
                  },
                  process.env.SECRET_KEY,
                  (err, token) => {
                    res.status(200).json({
                      id: user._id,
                      name: user.name,
                      username: user.username,
                      blueTick: user.blueTick,
                      avatar: user.avatar ? user.avatar : null,
                      token: token,
                      refreshToken: refreshToken,
                    });
                  }
                );
              }
            }
          }
        );
      } else {
        res.status(403).json({
          message: "Token is not found",
          success: false,
        });
      }
    } catch (error) {
      next(error);
    }
  }
})();
