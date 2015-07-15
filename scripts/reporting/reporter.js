define([ "reportTypes", "boardDiffEngine", "colorEffects", "jquery", "Chart", "helperMethods", "pedalDataAccess", "pedalBoardClasses", "stringReplacer", "textResources", "jquery-ui", "domReady!" ], 
function (reportTypes, boardDiffEngine, colorEffects, $, Chart, helpers, pedalDataAccess, classes, stringReplacer, resources) {
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
	
	function addLegend(chartToGet, chartContainer) { 
		var helpers = Chart.helpers;
	
		var legendHolder = document.createElement('div');
		legendHolder.className = "above-screen-block fixed report-legend";
		
		legendHolder.innerHTML = chartToGet.generateLegend();
		// Include a html legend template after the module doughnut itself
		helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index){
			helpers.addEvent(legendNode, 'mouseover', function(){
				var activeSegment = chartToGet.segments[index];
				activeSegment.save();
				activeSegment.fillColor = activeSegment.highlightColor;
				chartToGet.showTooltip([activeSegment]);
				activeSegment.restore();
			});
		});
		helpers.addEvent(legendHolder.firstChild, 'mouseout', function(){
			chartToGet.draw();
		});
		
		return $(legendHolder).appendTo(chartContainer);
	}
	
	/* ! Public Functions ! */
	var methods = {};
	
	methods.report = function (board, type) {
		assertIsPedalBoard(board);
				/* Set up the title & other information */
		var title = stringReplacer.replace(resources.reportBoardTitle, [ resources[type.resource], board.Name ]);
		
		var title = $("<header>", { "class": "fixed above-screen-block shadowed" })
			.append($("<div>", { "class" : "report-title" })
				.append($("<span>", { "class": "tooltip", "data-tooltip": title }).text(title)));
		
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
			.append(canvas);
		
		var myChart;
		var myLegend;
		var blocker = $("<div>", { "class": "screen-block" });
		
		/* append everything to the body */
		blocker.add(reportContainer).add(title)
			.appendTo(document.body)
		/* when one of them gets clicked close it all */
			.add(myLegend).click(function () {
				blocker.add(reportContainer).add(title).add(myLegend).remove();
				myChart.destroy();
			});
					
		myChart = new Chart(canvas.getContext("2d")).Doughnut(data, type.options);
		
		myLegend = addLegend(myChart, reportContainer);
	}
	
	methods.compare = function (boardA, boardB, type) {
		assertIsPedalBoard(boardA);
		assertIsPedalBoard(boardB);
		
		/* Set up the title & other information */
		var typeName = resources[type.resource];
		var aMinusBTitle = stringReplacer.replace(resources.reportBoardDiffTitle, [ typeName, boardA.Name, boardB.Name ]);
		var bMinusATitle = stringReplacer.replace(resources.reportBoardDiffTitle, [ typeName, boardB.Name, boardA.Name ]);
		
		var title = $("<header>", { "class": "fixed above-screen-block shadowed" })
			.append($("<div>", { "class" : "report-title left-side" })
				.append($("<span>", { "class" : "tooltip", "data-tooltip": aMinusBTitle }).text(aMinusBTitle)))
			.append($("<div>", { "class" : "report-title right-side" })
				.append($("<span>", { "class" : "tooltip", "data-tooltip": bMinusATitle }).text(bMinusATitle)));
		
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
			.append(aMinusBCanvas);
		
		var bMinusAContainer = $("<div>", { "class": "above-screen-block report-container right-side" })
			.append(bMinusACanvas);
		
		var aMinusBChart;
		var bMinusAChart;
		var blocker = $("<div>", { "class": "screen-block" });
		
		var elsToRemoveOnClick = $([]);
		
		/* attach stuff to the body */
		elsToRemoveOnClick = elsToRemoveOnClick.add(
			
			blocker.add(aMinusBContainer).add(bMinusAContainer).add(title)
				.appendTo(document.body));
		/* when any of them are clicked on, close it all */
		elsToRemoveOnClick.click(function () {
				elsToRemoveOnClick.remove();
				aMinusBChart.destroy();
				bMinusAChart.destroy();
			});
	
		aMinusBChart = new Chart(aMinusBCanvas.getContext("2d")).Doughnut(aMinusBData, type.options);
		bMinusAChart = new Chart(bMinusACanvas.getContext("2d")).Doughnut(bMinusAData, type.options);
		
		elsToRemoveOnClick = elsToRemoveOnClick.add(addLegend(aMinusBChart, aMinusBContainer));
		elsToRemoveOnClick = elsToRemoveOnClick.add(addLegend(bMinusAChart, bMinusAContainer));
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