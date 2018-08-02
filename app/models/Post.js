const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  privacy: String,
  username: String,
  postHeader: String,
  postContent: String,
  date: Date
});

const Posts = mongoose.model('Post', postSchema);

module.exports = Posts;
