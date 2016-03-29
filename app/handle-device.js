var EventSource = require('eventsource'); // Pull in event source
var PulseModel  = require('./models/PulseModel.js');
module.exports = function(deviceUrl, io){
	var es = new EventSource(deviceUrl);
	var curr = [];
	es.addEventListener('start', function(e){
		curr=curr.concat(parseData(e));	
		console.log("ey");
	});
	es.addEventListener('dat', function(e){
		curr=curr.concat(parseData(e));	

	});
	es.addEventListener('end', function(e){
		curr=curr.concat(parseData(e));	
		console.log(curr);
		addRecord(curr, io); // Add pulse record to database
		curr=[];
	}); 
	
}

function parseData(data){
	var holder = JSON.parse(JSON.parse(data.data).data); // Unwrap both layers of odd JSON: data:"data":"[]" 
	return holder
}

function addRecord(currentDataArray, io){
	var newRecord = new PulseModel({pulse_data: currentDataArray, time: Date.now()}); // create new record
	newRecord.save(function(err,event){
		if(err) console.log("error in saving to database"+err);
	})
	io.emit('new',newRecord);
}
