var EventSource = require('eventsource'); // Pull in event source
var PulseModel  = require('./models/PulseModel.js');
module.exports = function(deviceUrl){
	var es = new EventSource(deviceUrl);
	var curr = [];
	es.addEventListener('start', function(e){
		curr=curr.concat(parseData(e));	
	});
	es.addEventListener('dat', function(e){
		curr=curr.concat(parseData(e));	

	});
	es.addEventListener('end', function(e){
		curr=curr.concat(parseData(e));	
		console.log(curr);
		addRecord(curr);
		curr=[];
	}); 
	
}

function parseData(data){
	var holder = JSON.parse(JSON.parse(data.data).data); // Unwrap both layers of odd JSON: data:"data":"[]" 
	return holder
}

function addRecord(currentDataArray){
	var newRecord = new PulseModel({pulse_data: currentDataArray, time: Date.now()}); // create new record
	newRecord.save(function(err,event){
		if(err) console.log("error in database saving"+err);
	})
}
