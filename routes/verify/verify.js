const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("./verifyToken");

router.use(verifyToken, (req, res, next) => {
  jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    if (err) {
      res.status(403).json({
        message : "Your token has expired",
        success : false
      });
    } else {
      req.userData = authData
      next();
    }
  });
});

module.exports = router;
