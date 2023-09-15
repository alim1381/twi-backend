const mongoose = require("mongoose");
const Schima = mongoose.Schema;

const chatSchima = new Schima(
  {
    text: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    chatListId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatList",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchima, "chat");
