define([ "reportTypes", "reportDataHelpers", "boardDiffEngine", "jquery", "Chart", "domReady!" ], function (reportTypes, reportDataHelpers, boardDiffEngine, $, Chart) {
	"use strict";
	
	var methods = {};
	
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
		
	methods.compare = function (boardA, boardB, type) {
		/* get the unique pedals of each board to show the reports for */		
		var aMinusB = boardDiffEngine.GetUniquePedals(boardA, boardB); 
		var bMinusA = boardDiffEngine.GetUniquePedals(boardB, boardA);
		
		/* set up the data */		
		var aMinusBData;
		var bMinusAData;
		
		if (type.id === reportTypes.price.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.diff.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.pedalType.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.color.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else
			throw new Error("compareType param is not valid or not implemented!")
		
		/* set up the display */
		var aMinusBCanvas = document.createElement("canvas");
		var bMinusACanvas = document.createElement("canvas");
		
		var aMinusBContainer = $("<div>", { "class": "above-screen-block report-container left-side" })
			.append(aMinusBCanvas)
			.appendTo(document.body);
		
		var bMinusAContainer = $("<div>", { "class": "above-screen-block report-container right-side" })
			.append(bMinusACanvas)
			.appendTo(document.body);
		
		var aMinusBChart;
		var bMinusAChart;
		var blocker = $("<div>", { "class": "screen-block" })
			.appendTo(document.body)
			/* when any of them are clicked on, close it all */
			.add(aMinusBCanvas).add(bMinusACanvas)
				.click(function () {
					blocker.add(aMinusBContainer).add(bMinusAContainer).remove();
					aMinusBChart.destroy();
					bMinusAChart.destroy();
				});
		
		aMinusBChart = new Chart(aMinusBCanvas.getContext("2d")).Doughnut(aMinusBData);
		bMinusAChart = new Chart(bMinusACanvas.getContext("2d")).Doughnut(bMinusAData);
	};
	
	return methods;
});