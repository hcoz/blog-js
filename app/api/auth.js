const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../../config');
const User = require('../models/User');

exports.login = async (req, res) => {
  let userName = req.body.username;
  let password = req.body.password;

  let user = await User.findOne({ 'username': userName });

  if (user && await bcrypt.compare(password, user.password)) {
    let token = await jwt.sign({ 'username': userName }, config.jwt.privateKey, { expiresIn: '12h' });
    res.status(200).json({ 'redirect': 'home.html', 'token': token });
  } else {
    res.status(401).json({ 'message': 'Username or Password is wrong!'});
  }
};

exports.register = async (req, res) => {
  let userName = req.body.regusername;
  let password = req.body.regpassword;
  let password2 = req.body.regpassword2;

  if (!userName || !password)
    res.status(400).json({ 'message': 'Username or Password is not found!' });
  else if (password !== password2)
    res.status(400).json({ 'message': 'Passwords are not equal!' });

  const hash = await bcrypt.hash(password, config.db.saltRounds);

  let newUser = new User({
    username: userName,
    password: hash
  });

  let countResult = await User.countDocuments({ 'username': userName });
  if (countResult > 0)
    res.status(400).json({ 'message': 'Username already exists. Please select another one!' });

  let saveResult = await newUser.save();
  if (saveResult.errors)
    res.status(401).json({ 'message': 'User can\'t be registered. Please try again' });

  let token = await jwt.sign({ 'username': userName }, config.jwt.privateKey, { expiresIn: '12h' });
  res.status(200).json({ 'redirect': 'home.html', 'token': token });
};
