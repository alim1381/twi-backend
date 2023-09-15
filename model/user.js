const mongoose = require("mongoose");
const Schima = mongoose.Schema;

const userSchima = new Schima(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchima);
