const path = require('path');

const auth = require('./api/auth');

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../public/views/index.html'));
  });

  app.post('/api/login', auth.login);
  app.post('/api/register', auth.register);
};
