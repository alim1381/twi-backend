const mongoose = require("mongoose");
const Schima = mongoose.Schema;

const userSchima = new Schima(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    blueTick: { type: Boolean, default: false, required: true },
    avatar: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchima);
