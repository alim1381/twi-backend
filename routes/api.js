const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));

router.use("/chat", require("./chat"));

router.all("*", (req, res, next) => {
  try {
    let err = new Error("Not Found");
    err.status = 404;
    throw err;
  } catch (error) {
    next(error);
  }
});

router.use((err , req , res , next) => {
    const status = err.status || 500
    const message = typeof err.message === "string" ? err.message : 'Noting'
    const stack = err.stack
    res.status(status ? status : 500).json({
        message : message,
        stack : stack,
    })
})

module.exports = router;
