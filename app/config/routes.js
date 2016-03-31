/*
 * Set up the application's routes.
 */

var express = require('express');
var PulseModel = require('../models/PulseModel.js');
module.exports = function(app) { 
	app.get('/api/list', function(req,res){
		PulseModel.find({}, function(err, records){
			if (err) res.send(err);
			//res.json(records);
			var toReturn = records.map(function(a) { return {"_id":a._id, "time":a.time}});
			res.json(toReturn);
		}); 
	}); 
	app.get('/api/pulse/:id', function(req,res){
		var currentID = req.params.id; 
		PulseModel.findOne({_id:currentID}, function(err, record){
			if(err) res.send(err);
			res.json(record);
		});
	});
	app.get('/api/del/:id', function(req,res){
		var currentID = req.params.id; 
		PulseModel.remove({_id: currentID}, function(err){
			if (err) res.send("Error: "+err);
			else res.send("OK");
		});
	});
};
