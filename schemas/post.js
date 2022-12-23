const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  // userid: {
  //   type: Number,
  //   required: true,
  //   unique: true
  // }
  user: {
    type: String,
    required: true,
    // unique: true
  },
  password: {
    type: Number,
    required: true,
    // unique: true
  },
  title: {
    type: String
  },
  content: {
    type: String
  }
});

module.exports = mongoose.model("Posts", postsSchema);