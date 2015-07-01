define([ "reportTypes", "boardDiffEngine", "colorEffects", "jquery", "Chart", "helperMethods", "pedalDataAccess", "pedalBoardClasses", "domReady!" ], function (reportTypes, boardDiffEngine, colorEffects, $, Chart, helpers, pedalDataAccess, classes) {
	"use strict";
		
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
	
	function assertIsPedalBoard(board) {
		if(!(board instanceof classes.PedalBoard))
			throw new TypeError("Board is not a valid pedal board object!");
	}
	
	function getData(items, getName, getValue, getColor) {
		var output = [];
		helpers.forEach(items, function (item) {
			var color = getColor(item);
			output.push({
				value: getValue(item),
				label: getName(item),
				color: color,
				highlight: colorEffects.highlight(color, 0.1), /*10% lighter*/
			});
		});
		return output;
	}
	
	function getPriceData(pedals) {
		return getData(pedals, 
			function (pedal) { return pedal.displayName || pedal.name; },  /* getName */
			function (pedal) { return pedal.price; }, /* getValue */
			function (pedal) { return pedal.color; }); /* getColor */
	}
	
	function getTypeData(pedals) {
		var pedalTypeIds = helpers.select(pedals, function (pedal) {
			return pedal.type;
		});
		
		var types = helpers.where(pedalDataAccess.types, function (type) {
			return pedalTypeIds.indexOf(type.id) !== -1;
		});
		
		return getData(types, 
			function (type) { return type.name; },/* getName */
			function (type) { /* getValue */ 
				return helpers.where(pedalTypeIds, function (pedalTypeId) {
					return pedalTypeId === type.id;
				}).length; /* get the number of pedals on the board of this type */ 
			},
			function (type) { /* getColor */
				return helpers.first(
					helpers.where(pedals, function (pedal) {
						return pedal.type === type.id;
					})
				).color; /* get the color of the first pedal of this type */ 
			});
	}
	
	function getColorData(pedals) {
		var pedalColors = helpers.select(pedals, function (pedal) {
			return colorEffects.round(pedal.color);
		});
		
		var allColors = helpers.distinct(pedalColors, function (item) { return item.color; });
		
		return getData(allColors, 
			function (color) { return color.name; },/* getName */
			function (color) { /* getValue */ 
				return helpers.where(pedalColors, function (pedalColor) {
					return pedalColor.color === color.color;
				}).length; /* get the number of pedals on the board of this color */ 
			},
			function (color) { return color.color; }); /* getColor */
	}
	
	/* ! Public Functions ! */
	var methods = {};
	
	methods.report = function (board, type) {
		assertIsPedalBoard(board);
		/* set up the data */		
		var data;
		
		if (type.id === reportTypes.price.id)
			data = getPriceData(board.pedals);
		else if (type.id == reportTypes.pedalType.id)
			data = getTypeData(board.pedals);
		else if (type.id == reportTypes.color.id)
			data = getColorData(board.pedals);
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
		
		myChart = new Chart(canvas.getContext("2d")).Doughnut(data, type.options);
	}
	
	methods.compare = function (boardA, boardB, type) {
		assertIsPedalBoard(boardA);
		assertIsPedalBoard(boardB);
		
		/* get the unique pedals of each board to show the reports for */		
		var aMinusB = boardDiffEngine.GetUniquePedals(boardA, boardB); 
		var bMinusA = boardDiffEngine.GetUniquePedals(boardB, boardA);
		
		/* set up the data */		
		var aMinusBData;
		var bMinusAData;
		
		if (type.id === reportTypes.price.id) {
			aMinusBData = getPriceData(aMinusB);
			bMinusAData = getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.diff.id) {
			aMinusBData = getPriceData(aMinusB);
			bMinusAData = getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.pedalType.id) {
			aMinusBData = getTypeData(aMinusB);
			bMinusAData = getTypeData(bMinusA);
		}
		else if (type.id == reportTypes.color.id) {
			aMinusBData = getColorData(aMinusB);
			bMinusAData = getColorData(bMinusA);
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
		
		aMinusBChart = new Chart(aMinusBCanvas.getContext("2d")).Doughnut(aMinusBData, type.options);
		bMinusAChart = new Chart(bMinusACanvas.getContext("2d")).Doughnut(bMinusAData, type.options);
	};
	
	/* return internal functions in a "private" object of the class for the sake of unit testing */
	methods.__privates = {
		getData: getData,
		getPriceData: getPriceData,
		getTypeData: getTypeData,
		getColorData: getColorData
	};
	
	return methods;
});