const mongoose = require("mongoose");
const Schima = mongoose.Schema;

const postSchima = new Schima(
  {
    textBody: { type: String, require: true },
    image: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchima);
