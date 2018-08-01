const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('js', express.static(__dirname + '/public/js'));

mongoose.connect(config.db.connectionString)
  .catch(err => console.error(err));

require('./app/routes')(app);

app.listen(port, () => {
  console.log('server is running on port ', port);
});
