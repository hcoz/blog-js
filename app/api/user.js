const jwt = require('jsonwebtoken');

const config = require('../../config');
const errorHandlers = require('../helpers/error-handler');
const Follower = require('../models/Follower');

exports.userList = async (req, res) => {
  let token = req.headers.authorization;
  try {
    let verified = await jwt.verify(token, config.jwt.secretKey);
    let users = await Follower.find({}, 'follower');
    let followers = await Follower.findOne({ 'follower': verified.username }, 'follows');
    let userList = [];

    for (let i in users) {
      if (followers.follows.includes(users[i].follower))
        userList.push({ user: users[i], isFollow: true });
      else
        userList.push({ user: users[i], isFollow: false });
    }

    res.status(200).json({ 'userList': userList });
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};

exports.follow = async (req, res) => {
  let token = req.headers.authorization;
  let follow = req.body.follow;

  try {
    let verified = await jwt.verify(token, config.jwt.secretKey);
    let followResult = await Follower.update({ follower: verified.username },
      {
        $addToSet: {
          follows: follow
        }
      },
      { upsert: true });

    if (followResult.errors)
      res.status(400).json({ 'message': 'You can\'t follow! Please try again' });
    else
      res.status(200).json({ 'username': follow, 'isFollow': true });
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};

exports.unfollow = async (req, res, next) => {

};
