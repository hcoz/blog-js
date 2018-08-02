const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  follower: String,
  follows: [String]
});

const Followers = mongoose.model('Follower', followerSchema);

module.exports = Followers;
