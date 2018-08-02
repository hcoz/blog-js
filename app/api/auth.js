const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const errorHandlers = require('../helpers/error-handler');
const User = require('../models/User');
const Follower = require('../models/Follower');

exports.login = async (req, res, next) => {
  let userName = req.body.username;
  let password = req.body.password;

  try {
    let user = await User.findOne({ 'username': userName });

    if (user && await bcrypt.compare(password, user.password)) {
      let token = await jwt.sign({ 'username': userName }, config.jwt.secretKey, { expiresIn: '12h' });
      res.status(200).json({ 'redirect': '/home', 'token': token });
      return next();
    } else {
      res.status(401).json({ 'message': 'Username or Password is wrong!' });
      return next();
    }
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};

exports.register = async (req, res, next) => {
  let userName = req.body.regusername;
  let password = req.body.regpassword;
  let password2 = req.body.regpassword2;

  // check neessary information for registration
  if (!userName || !password) {
    res.status(400).json({ 'message': 'Username or Password is not found!' });
    return next();
  } else if (password !== password2) {
    res.status(400).json({ 'message': 'Passwords are not equal!' });
    return next();
  }

  try {
    const hash = await bcrypt.hash(password, config.db.saltRounds);

    let newUser = new User({
      username: userName,
      password: hash
    });

    // return response if same username is already exist
    let countResult = await User.countDocuments({ 'username': userName });
    if (countResult > 0) {
      res.status(400).json({ 'message': 'Username already exists. Please select another one!' });
      return next();
    }

    // save new user
    let saveResult = await newUser.save();
    if (saveResult.errors) {
      res.status(401).json({ 'message': 'User can\'t be registered. Please try again' });
      return next();
    }

    // add to followers collection
    let newFollower = new Follower({
      follower: userName,
      follows: []
    });
    // if user can't be added to followers collection it can be fixed in follow action
    await newFollower.save();

    let token = await jwt.sign({ 'username': userName }, config.jwt.secretKey, { expiresIn: '12h' });
    res.status(200).json({ 'redirect': '/home', 'token': token });
    return next();
  } catch (err) {
    errorHandlers.catchError(err, res);
  }
};
