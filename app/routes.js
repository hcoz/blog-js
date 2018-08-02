const path = require('path');

const auth = require('./api/auth');
const post = require('./api/post');
const user = require('./api/user');

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/views/index.html'));
  });

  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/views/home.html'));
  });

  app.post('/api/login', auth.login);
  app.post('/api/register', auth.register);
  app.post('/api/post/publish', post.publish);
  app.post('/api/follow', user.follow);
  app.post('/api/unfollow', user.unfollow);
  app.get('/api/userlist', user.userList);
};
