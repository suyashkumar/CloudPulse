
var myApp = angular.module('pulseapp', []);
// Set up Controllers:
myApp.controller("mainController", function($scope,$http){
	var updateView=function(){
		$http.get('/api/list').success(
			function(data){
				$scope.scanList=data;
				console.log(data)
			})
		
	}
	var updateGraphSelectionById=function(id){
	    $http.get('/api/list').success(
			function(data){
				$scope.scanList=data;
				console.log(data)
			
	
		for (var i=0;i<$scope.scanList.id.length;i++){
			console.log($scope.scanList.id[i]);
			if($scope.scanList.id[i].toString().localeCompare(id.toString())==0){
				console.log('update')
				$scope.updateGraphSelection(i);	
				console.log($scope.scanList.id[i])
				console.log(id)

			}
		}
		});
	}

	updateView();
	data_temp=[{"key":"test","values":[]}];
	eSource=new EventSource("/data_source");
	eSource.onmessage=function(message){
		console.log("Message with data")
		console.log(message.data); 
		console.log(message.data.toString())
		console.log("----");
		console.log($scope.scanList.id)
		updateGraphSelectionById(message.data) 
	}



	$scope.updateGraphSelection=function(index){
		$scope.currentExamIndex=index

		var graphData=[{"key":"pulse","values":[]}]
		for (var i=0;i<250;i++){
			graphData[0]["values"].push([i,$scope.scanList.data[index][i]])	
		}
		console.log(graphData);
		updateGraph(graphData);
	}

	$scope.download=function(){	
		location.href='/api/download/'.concat($scope.scanList.id[$scope.currentExamIndex])
	}
	
	$scope.delCurrentExam=function(){
		$scope.delExam($scope.currentExamIndex);	
	}

	$scope.delExam=function(index){

		$http.get('/api/del/'.concat($scope.scanList.id[index])).success(
			function(data){
				console.log('Del successful')
				updateView(); // Update list view
				if (index==0){
					$scope.updateGraphSelection(index+1);
				}
				else{
					$scope.updateGraphSelection(index-1);
				}
			});

	}







});

var updateGraph=function(data){
//	data=[{"key":"test","values":[[1,2],[3,4]]}];
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

