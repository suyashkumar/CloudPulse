angular.module('CloudPulse',['ngMaterial'])

.controller('CloudPulseCtrl', function($scope, $http) {

	updateList($scope,$http, function(data){
		$scope.select(data[0]._id); // Select first graph once scanList is loaded
	});

	$scope.select = function(selID){
		$http.get('api/pulse/'+selID).success(
			function(data){

				var graphValues=[];
				for (i=0; i<data.pulse_data.length; i++){
					graphValues.push({x:i,y: data.pulse_data[i], area:false});	
				}
				updateGraph([{"key":"PulseData","values":graphValues, "area":false}]); 
				$scope.currData = data;
				$scope.currID = selID;
			});
	}
	$scope.delExam = function(currID){
		$http.get('/api/del/'+currID).success(
			function(resp){
				updateList($scope, $http, function(data){
					$scope.select(data[0]._id); // Select first graph once scanList is loaded
				}); 
			});
	} 
	$scope.genCSV = function(currData){
		var csvOut="";
		for (i=0;i<currData.pulse_data.length;i++){
			csvOut=csvOut+i+","+currData.pulse_data[i]+"\n";	
		}
		var blob = new Blob([csvOut], {type:"text/csv;charset=utf-8"});
		saveAs(blob, currData._id+".csv");
	}

	var socket = io('http://localhost:9000');
	socket.on('new', function(data){
		$scope.select(data._id);
	});


});

var updateList = function($scope,$http, callback){
	$http.get('/api/list').success(
		function(data){
			$scope.scanList=data;
			callback(data);

		}
	);
	
}



var updateGraph = function(data){
	nv.addGraph(function() {
  var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!  
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
  ;

  chart.xAxis     //Chart x-axis settings
      .axisLabel('Time (ms)')
      .tickFormat(d3.format(',r'));

  chart.yAxis     //Chart y-axis settings
      .axisLabel('Voltage (v)')
      .tickFormat(d3.format('.02f'));

  /* Done setting the chart up? Time to render it!*/
 

  d3.select('#pulse svg')    //Select the <svg> element you want to render the chart in.   
      .datum(data)         //Populate the <svg> element with chart data...
      .call(chart)          //Finally, render the chart!
	  .style({ 'width': "100%", 'height': 300 });
d3.select('#pulse svg').datum(data).transition().duration(500).call(chart).style({ 'width': "100%", 'height': 300 });
	
  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}
function makeGraphData(data){
	var currLabels=Array.apply(null, {length: data.pulse_data.length}).map(Number.call, Number);
	return {labels:currLabels, datasets:[{data:data.pulse_data, datasetFill:false, pointDot:false, showXLabels:10, strokeColor:"black"}]}; 

}

