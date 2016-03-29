/*
 * Entry of the web application
 */

// Set up Express.js
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Load libraries
var bodyParser = require('body-parser');
var morgan = require('morgan');


// Set up logging
app.use(morgan('dev'));

// Set up body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set up static content
app.use(express.static(__dirname + '/node_modules')); // client-side frameworks
app.use(express.static(__dirname + '/public')); // HTML, CSS

// Set up favicon
//app.use(favicon(__dirname + '/public/favicon.ico'));

// Connect to Mongodb
require('./config/db')();

// Set up app routes
require('./config/routes')(app);

// Set up device handler
require('./handle-device')('https://api.particle.io/v1/devices/events?access_token=6a61e063f79781dddcc39729e77ed76696f23bfc');

exports = module.exports = app;
if (!module.parent) {
  var port = process.env.PORT || 8080; // 8080 as default
  // On Linux make sure you have root to open port 80
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
}

