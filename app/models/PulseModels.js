/*
 * Mongoose schema for DUU Events 
 */ 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PulseDataSchema = new Schema({ 
	pulse_data:	{type: [Number], required: true, trim: true}, 
	time:		{type: Date, required: true, default: Date.now},
	pulse:		{type:Number, required: false, default: -1}		
});
module.exports = mongoose.model('PulseData', PulseDataSchema);
