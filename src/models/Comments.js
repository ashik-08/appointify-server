const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const commentSchema = new mongoose.Schema({
  blogId: String,
  userId: String,
  image: String,
  title: String,
  comment: String,
  name: String,
  email: String,
  date: String,
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
