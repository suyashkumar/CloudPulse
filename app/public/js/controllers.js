angular.module('CloudPulse',['ngMaterial'])

.controller('CloudPulseCtrl', function($scope, $http) {
	//updateGraph([{"key":"test","values":[[1,2],[3,4], [4,3]], "area":false}])
	updateList($scope,$http);

	$scope.select = function(selID){
		$http.get('api/pulse/'+selID).success(
			function(data){

				var graphValues=[];
				for (i=0; i<data.pulse_data.length; i++){
					graphValues.push({x:i,y: data.pulse_data[i], area:false});	
				}
				updateGraphT([{"key":"PulseData","values":graphValues, "area":false}]);
				
			//updateGraphAc([{"key":"PulseData","values":graphValues, "area":false}], $scope);
		
			console.log([{"key":"PulseData","values":graphValues, "area":false}])
			});
	}
	/*
	var socket = io('http://localhost:9000');
	socket.on('new', function(data){
		$scope.select(data._id);
	});*/


});

var updateList = function($scope,$http){
	$http.get('/api/list').success(
		function(data){
			$scope.scanList=data;
		}
	);
}

var updateGraphAc=function(data, $scope){
$scope.options={chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 40,
                    left: 55
                },
                x: function(d){ return d.x; },
                y: function(d){ return d.y; },
                useInteractiveGuideline: true,
                dispatch: {
                    stateChange: function(e){ console.log("stateChange"); },
                    changeState: function(e){ console.log("changeState"); },
                    tooltipShow: function(e){ console.log("tooltipShow"); },
                    tooltipHide: function(e){ console.log("tooltipHide"); }
                },
                xAxis: {
                    axisLabel: 'Time (ms)'
                },
                yAxis: {
                    axisLabel: 'Voltage (v)',
                    tickFormat: function(d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: -10
                },
                callback: function(chart){
                    console.log("!!! lineChart callback !!!");
                }
            },
            title: {
                enable: true,
                text: 'Title for Line Chart'
            },
            subtitle: {
                enable: true,
                text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                css: {
                    'text-align': 'center',
                    'margin': '10px 13px 0px 7px'
                }
  

            }}
	$scope.data1=data;

}
var updateGraph=function(){
	data=[{"key":"test","values":[[1,2],[3,4], [4,3]]}];
	nv.addGraph(function() {
		      var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline! 
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
                .x(function(d){return d[0]})
                .y(function(d) {return d[1]})
			.width(500)
			.height(300)
			//.forceY([0,3000]) ; 
			chart.yAxis     //Chart y-axis settings
			.axisLabel('Voltage')
			.tickFormat(d3.format('.02f'));
			chart.xAxis.axisLabel('Sample Number');
		    d3.select('#pulse svg')
		        .datum(data)
		        .call(chart);
		d3.select('#pulse svg').datum(data).transition().duration(500).call(chart).style({ 'width': 500, 'height': 300 });

		    //TODO: Figure out a good way to do this automatically
		     nv.utils.windowResize(function() { chart.update() });

		    return chart;
		    
  		});
	

	}

var updateGraphz=function(data){
    data=[{"key":"test","values":[[1,2],[3,4], [4,3]]}];
    nv.addGraph(function() {
              var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline! 
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
                .x(function(d){return d[0]})
                .y(function(d) {return d[1]})
            .width(500)
            .height(300)
            //.forceY([0,3000])
                          ;   
 

            chart.yAxis     //Chart y-axis settings
            .axisLabel('Voltage')
            .tickFormat(d3.format('.02f'));
            chart.xAxis.axisLabel('Sample Number');
            d3.select('#pulse svg')
                .datum(data)
                .call(chart);
        d3.select('#pulse svg').datum(data).transition().duration(500).call(chart).style({ 'width': 500, 'height': 300 }); 

            //TODO: Figure out a good way to do this automatically
             nv.utils.windowResize(function() { chart.update() }); 

            return chart;
    
        }); 
    

    }   
var updateGraphT = function(data){
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
  var myData = data; 
		d3.select('#pulse svg').datum(data).transition().duration(500).call(chart).style({ 'width': "100%", 'height': 300 });

  d3.select('#pulse svg')    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!
	
  //Update the chart when window resizes.
  nv.utils.windowResize(function() { chart.update() });
  return chart;
});
}
function makeGraphData(data){
	var currLabels=Array.apply(null, {length: data.pulse_data.length}).map(Number.call, Number);
	return {labels:currLabels, datasets:[{data:data.pulse_data, datasetFill:false, pointDot:false, showXLabels:10, strokeColor:"black"}]}; 

}
function updateGraphA(lineChartData){
	
	var randomScalingFactor = function(){ return Math.round(Math.random()*100)};
		/*
		var lineChartData = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
					label: "My First dataset",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				},
				{
					label: "My Second dataset",
					fillColor : "rgba(151,187,205,0.2)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(151,187,205,1)",
					data : [randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor(),randomScalingFactor()]
				}
			]

		}*/
	var ctx = document.getElementById("canvas").getContext("2d");
		window.myLine = new Chart(ctx).Line(lineChartData, {
			responsive: true,
			showXLabels:20,
			datasetFill:false,
			datasetStroke: true,
			datasetStrokeWidth : 5,
			pointDot:false
		});	

}


