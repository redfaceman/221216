const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  goodsId: {
    type: Number,
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Comment", commentSchema);