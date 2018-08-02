const User = require('../models/User');
const Follower = require('../models/Follower');

exports.userList = async (req, res, next) => {
  let users = await User.find({}, 'username');
  res.status(200).json({ 'userList': users });
};
