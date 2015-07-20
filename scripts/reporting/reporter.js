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
		return helpers.select(items, function (item) {
			var color = getColor(item);
			return {
				value: getValue(item),
				label: getName(item),
				color: color,
				highlight: colorEffects.highlight(color, 0.1), /*10% lighter*/
			};
		});
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
	
	function makeLegend(chartToGet) { 
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
		
		return legendHolder;
	}
		
	function makeTotal(total, count, template) {
		var mainText = stringReplacer.replace(template, [ total ]);
		var countText = stringReplacer.replace(resources.reportTotalPedlas, [ count ]);
		
		return $("<div>", { "class": "report-total" })
			.append($("<div>", { "class": "report-total-main" }).text(mainText))
			.append($("<div>", { "class": "report-total-count" }).text(countText));
	}
	
	function makeTitle(titleItems) {
		var titleBar = $("<header>", { "class": "fixed above-screen-block shadowed" });
		
		helpers.forEach(titleItems, function (titleItem) {
			$("<div>", { "class" : "report-title" })
				.addClass(titleItem.cssClass)
				.append($("<span>", { "class": "tooltip", "data-tooltip": titleItem.text }).text(titleItem.text))
				.appendTo(titleBar);
		});
	}
	
	function makeDisplay(cssClass, type, pedals) {
		/* set up the data */		
		var data;
		var total;
		var count = pedals.length;
		
		if (type.id === reportTypes.price.id) {
			data = getPriceData(pedals);
			total = 0;
			helpers.forEach(data, function (item) {
				total += item.value;
			});
		} else if (type.id == reportTypes.pedalType.id) {
			data = getTypeData(pedals);
			total = data.length;
		} else if (type.id == reportTypes.color.id) {
			data = getColorData(pedals);
			total = data.length;
		} else {
			throw new Error("Type param is not valid or not implemented!")
		}
		
		/* set up the display */
		var canvas = document.createElement("canvas");
		
		var reportContainer = $("<div>", { "class": "above-screen-block report-container" })
			.addClass(cssClass)
			.append(canvas);
		
		/* Add the total */
		var total = makeTotal(total, count, type.totalTemplate)
			.appendTo(reportContainer);
		
		var chart;
		
		/* Return all of the values so that they can be added as needed */
		return {
			container: reportContainer,
			total: total,
			getChart: function () { /* "lazy" chart return */
				chart = chart || (new Chart(canvas.getContext("2d")).Doughnut(data, type.options));
				return chart;
			},
		};
	}
	
	function handleDisplay(objs, titleBar, parent) {
		var blocker = $("<div>", { "class": "screen-block" });
		
		var closeAllOnClick = $(blocker, titleBar)
			.appendTo(parent);
		
		var charts = [];
		
		helpers.forEach(objs, function (obj) {			
			/* Add the dom container to be closed when any of them are clicked */
			closeAllOnClick = closeAllOnClick.add(
				obj.container.appendTo(parent) /* Append the container to the dom */
			);
			
			var chart = obj.getChart();
			
			/* Add the legend */
			$(makeLegend(chart)).appendTo(obj.container);
			
			/* Setup positioning the total */
			function posTotal() {
				obj.total.position({
					my: "center",
					at: "center",
					of: obj.container,
				});
			}
			
			$(window).resize(posTotal);
			posTotal();
			
			/* Add the chart object to be destoryed when we close it */
			charts.push(chart);
		});
		
		closeAllOnClick.click(function () {
			/* Remove all report from the dom! */
			closeAllOnClick.remove();
			
			/* Kill all the charts! */
			helpers.forEach(charts, function (chart) {
				chart.destroy();
			});
		});
	}
	
	
	/* ! Public Functions ! */
	var methods = {};
	
	methods.report = function (board, type) {
		assertIsPedalBoard(board);
		
		/* Create the chart Display */
		var display = makeDisplay("full-size", type, board.pedals);
				/* Set up the title */		
		var title = makeTitle({ 
			text: stringReplacer.replace(resources.reportBoardTitle, [ resources[type.resource], board.Name ])
		});
		
		/* Add it all */
		handleDisplay(display, title, document.body);
	}
	
	methods.compare = function (boardA, boardB, type) {
		assertIsPedalBoard(boardA);
		assertIsPedalBoard(boardB);
		
		/* Get the unique pedals of each board to show the reports for */		
		var aMinusB = boardDiffEngine.GetUniquePedals(boardA, boardB); 
		var bMinusA = boardDiffEngine.GetUniquePedals(boardB, boardA);
		
		/* Create the displays for each of the boards */
		var aMinusBDisplay = makeDisplay("left-side", type, aMinusB);
		var bMinusADisplay = makeDisplay("right-side", type, bMinusA);
		
		/* Set up the title */
		var typeName = resources[type.resource];
		
		var title = makeTitle([{
				text: stringReplacer.replace(resources.reportBoardDiffTitle, [ typeName, boardA.Name, boardB.Name ]),
				cssClass: "left-side",
			},
			{
				text: stringReplacer.replace(resources.reportBoardDiffTitle, [ typeName, boardB.Name, boardA.Name ]),
				cssClass: "right-side",
			}]);
		
		/* Add it all! */
		handleDisplay([aMinusBDisplay, bMinusADisplay], title, document.body);
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