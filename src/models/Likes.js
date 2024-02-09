const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const likeSchema = new mongoose.Schema({
  blogId: String,
  email: String,
});

const Likes = mongoose.model("Likes", likeSchema);

module.exports = Likes;
