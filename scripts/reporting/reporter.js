define([ "reportTypes", "boardDiffEngine", "jquery", "Chart", "helperMethods", "pedalDataAccess", "pedalBoardClasses", "textResources", "domReady!" ], function (reportTypes, boardDiffEngine, $, Chart, helpers, pedalDataAccess, classes, resources) {
	"use strict";
		
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
	
	function assertIsPedalBoard(board) {
		if(!(board instanceof classes.PedalBoard))
			throw new TypeError("Board is not a valid pedal board object!");
	}
	
	/* function content taken from http://www.sitepoint.com/javascript-generate-lighter-darker-color/ */
	function highlightColor(hex, luminance) {
		/* validate hex string -> convert #fff to #ffffff */
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
		}
		luminance = luminance || 0;

		/* convert to decimal and change luminosity */
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i*2,2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * luminance)), 255)).toString(16);
			rgb += ("00"+c).substr(c.length);
		}

		return rgb;
	}
	
	function getData(items, getName, getValue, getColor) {
		var output = [];
		helpers.forEach(items, function (item) {
			var color = getColor(item);
			output.push({
				value: getValue(item),
				label: getName(item),
				color: color,
				highlight: highlightColor(color, 0.1), /*10% lighter*/
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
	
	/* helper for getColorData */
	/* adapted from http://stackoverflow.com/questions/4057475/rounding-colour-values-to-the-nearest-of-a-small-set-of-colours */
	function roundColor(color) {
		/* Function to convert HEX to RGB */
		function hex2rgb( colour ) {
			var r,g,b;
			if ( colour.charAt(0) == '#' ) {
				colour = colour.substr(1);
			}

			r = colour.charAt(0) + colour.charAt(1);
			g = colour.charAt(2) + colour.charAt(3);
			b = colour.charAt(4) + colour.charAt(5);

			r = parseInt( r, 16 );
			g = parseInt( g, 16 );
			b = parseInt( b, 16);
			return [r, g, b];
		}
		
		var color_names = ["color_DarkRed","color_DarkRed","color_Red","color_Red","color_Pink","color_LightPurple","color_Purple","color_DarkBlue","color_Blue","color_Blue","color_Turquoise","color_LightGreen","color_Green","color_DarkGreen","color_YellowBrown","color_DarkYelow","color_Yellow","color_LightYellow","color_LightOrange","color_Orange","color_Orange","color_DarkOrange","color_LightBrown","color_Brown","color_Black","color_Gray","color_LightGray","color_White"];
		var base_colors = ["660000","990000","cc0000","cc3333","ea4c88","993399","663399","333399","0066cc","0099cc","66cccc","77cc33","669900","336600","666600","999900","cccc33","ffff00","ffcc33","ff9900","ff6600","cc6633","996633","663300","000000","999999","cccccc","ffffff"];

		/* Convert to RGB, then R, G, B */
		var color_rgb = hex2rgb(color);
		var color_r = color_rgb[0];
		var color_g = color_rgb[1];
		var color_b = color_rgb[2];

		/* Create an empty array for the difference between the colours */
		var differenceArray=[];

		/* Convert the HEX color in the array to RGB colors, split them up to R-G-B, then find out the difference between the "color" and the colors in the array */
		helpers.forEach(base_colors, function(value) { 
			var base_color_rgb = hex2rgb(value);
			var base_colors_r = base_color_rgb[0];
			var base_colors_g = base_color_rgb[1];
			var base_colors_b = base_color_rgb[2];

			/* Add the difference to the differenceArray */
			differenceArray.push(Math.sqrt((color_r-base_colors_r)*(color_r-base_colors_r)+(color_g-base_colors_g)*(color_g-base_colors_g)+(color_b-base_colors_b)*(color_b-base_colors_b)));
		});

		/* Get the lowest number from the differenceArray */
		var lowest = Math.min.apply( Math, differenceArray);

		/* Get the index for that lowest number */
		var index = differenceArray.indexOf(lowest);

		/* Return the HEX code */
		return {
			name: color_names[index],
			color: base_colors[index]
		};
	}
	
	function getColorData(pedals) {
		var pedalColors = helpers.select(pedals, function (pedal) {
			return roundColor(pedal.color);
		});
		
		var allColors = helpers.distinct(pedalColors, function (item) { return item.color; });
		
		return getData(allColors, 
			function (color) { return resources[color.name]; },/* getName */
			function (color) { /* getValue */ 
				return helpers.where(pedalColors, function (pedalColor) {
					return pedalColor.color === color.color;
				}).length; /* get the number of pedals on the board of this color */ 
			},
			function (color) { return "#" + color.color; }); /* getColor */
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
		getColorData: getColorData,
	};
	
	return methods;
});