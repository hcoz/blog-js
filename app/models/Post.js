const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var postSchema = new Schema({
  privacy: String,
  username: String,
  postHeader: String,
  postContent: String,
  date: Date
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;
