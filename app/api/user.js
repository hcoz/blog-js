const jwt = require('jsonwebtoken');

const config = require('../../config');
const errorHandlers = require('../helpers/error-handler');
const Follower = require('../models/Follower');

exports.userList = async (req, res) => {
  let token = req.headers.authorization;
  try {
    let verified = await jwt.verify(token, config.jwt.secretKey);
    let users = await Follower.find({}, 'follower');
    let followList = await Follower.findOne({ 'follower': verified.username }, 'follows');
    let userList = [];

    for (let i in users) {
      // skip the current user
      if (users[i].follower === verified.username)
        continue;
      
      if (followList.follows.includes(users[i].follower))
        userList.push({ userName: users[i].follower, isFollow: true });
      else
        userList.push({ userName: users[i].follower, isFollow: false });
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
      res.status(200).json({ 'userName': follow, 'isFollow': true });
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};

exports.unfollow = async (req, res) => {
  let token = req.headers.authorization;
  let unfollow = req.body.unfollow;

  try {
    let verified = await jwt.verify(token, config.jwt.secretKey);
    let followResult = await Follower.update({ follower: verified.username },
      {
        $pull: {
          follows: unfollow
        }
      },
      { upsert: true });

    if (followResult.errors)
      res.status(400).json({ 'message': 'You can\'t follow! Please try again' });
    else
      res.status(200).json({ 'userName': unfollow, 'isFollow': false });
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};
