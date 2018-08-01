const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
});

var Users = mongoose.model('User', userSchema);

module.exports = Users;