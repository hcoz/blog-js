'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

require('./app/routes')(app);

app.listen(port, () => {
  console.log('server is running on port ', port);
});
