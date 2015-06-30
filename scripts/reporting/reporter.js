define([ "reportTypes", "reportDataHelpers", "jquery", "Chart", "domReady!" ], function (reportTypes, reportDataHelpers, $, Chart) {
	"use strict";
	
	var methods = {};
	
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
	
	methods.report = function (board, type) {
		/* set up the data */		
		var data;
		
		if (type.id === reportTypes.price.id)
			data = reportDataHelpers.getPriceData(board.pedals);
		else if (type.id == reportTypes.pedalType.id)
			data = reportDataHelpers.getTypeData(board.pedals);
		else if (type.id == reportTypes.color.id)
			data = reportDataHelpers.getColorData(board.pedals);
		else
			throw new Error("Type param is not valid or not implemented!")
		
		/* set up the display */
		var canvas = document.createElement("canvas");
		
		var reportContainer = $("<div>", { "class": "above-screen-block report-container full-size" })
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
	};
	
	return methods;
});