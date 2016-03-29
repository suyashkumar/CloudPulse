/*
 * Set up the application's routes.
 */

var express = require('express');

module.exports = function(app) { 
  app.get('/', function(req,res){
  	res.send("hello");
  });

};
