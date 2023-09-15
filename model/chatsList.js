const mongoose = require("mongoose");
const Schima = mongoose.Schema;

const chatListSchima = new Schima(
  {
    firstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    secondUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chatList", chatListSchima, "chatList");
