const jwt = require('jsonwebtoken');

const config = require('../../config');
const errorHandlers = require('../helpers/error-handler');
const Post = require('../models/Post');

exports.publish = async (req, res, next) => {
  let postPrivacy = req.body.privacy;
  let postHeader = req.body.header;
  let postContent = req.body.content;
  let token = req.headers.authorization;

  if (!postPrivacy || !postHeader || !postContent) {
    res.send(400).json({ 'message': 'Missing post information' });
    return next();
  }

  try {
    let verified = await jwt.verify(token, config.jwt.secretKey);
    let newPost = new Post({
      username: verified.username,
      privacy: postPrivacy,
      postHeader: postHeader,
      postContent: postContent,
      date: Date.now()
    });
    let saveResult = await newPost.save();

    if (saveResult.errors)
      res.status(401).json({ 'message': 'Post can\'t be published. Please try again' });
    else
      res.status(200).json({ 'message': 'Your post is published' });
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};
