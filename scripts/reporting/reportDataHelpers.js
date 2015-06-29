define([ "helperMethods", "Chart", "jquery" ], function ( helpers, Chart, $ ) {
	"use strict";
	
	var methods = {};
	
	methods.getData = function(pedals, getName, getValue, color, highlight) {
		var output = [];
		helpers.forEach(pedals, function (pedal) {
			output.push({
				value: getValue(pedal),
				label: getName(pedal),
				color: color,
				highlight: highlight,
			});
		});
		return output;
	};
	
	methods.getPriceData = function(pedals) {
		return methods.getData(pedals, 
			function (pedal) { return pedal.name; },
			function (pedal) { return pedal.price; }, 
			"#F7464A", "#FF5A5E");
	};
	
	methods.chart = function(data, canvasCssClass) {
		var canvas = document.createElement("canvas");
		canvas.className = "report " + canvasCssClass;
		
		var reportContainer = $("<div>", { "class": "above-screen-block report-container" })
			.append(canvas)
			.appendTo(document.body);
		
		var myChart;
		var blocker = $("<div>", { "class": "screen-block" })
			.appendTo(document.body)
			.add(canvas).click(function () {
				blocker.add(reportContainer).remove();
				myChart.destroy();
			});
		
		myChart = new Chart(canvas.getContext("2d")).Doughnut(data);
	}
	
	return methods;
});