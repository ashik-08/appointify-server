const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  intro: {
    type: String,
    required: true,
  },
  main_content: [
    {
      heading: String,
      content: String,
    },
  ],
  conclusion: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  tags: [String],
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
  author_info: {
    author_name: {
      type: String,
      required: true,
    },
    author_image: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  reading_time: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
