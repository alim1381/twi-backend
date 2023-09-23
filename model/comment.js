const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    postId: { type: mongoose.Types.ObjectId, required: true, ref: "post" },
    authorId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema, "comment");
