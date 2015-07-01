define([ "helperMethods", "pedalDataAccess", "textResources" ], function (helpers, pedalDataAccess, resources) {
	"use strict";
	
	var methods = {};
	
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
	
	methods.getData = function(items, getName, getValue, getColor) {
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
	};
	
	methods.getPriceData = function(pedals) {
		return methods.getData(pedals, 
			function (pedal) { return pedal.displayName || pedal.name; },  /* getName */
			function (pedal) { return pedal.price; }, /* getValue */
			function (pedal) { return pedal.color; }); /* getColor */
	};
	
	methods.getTypeData = function(pedals) {
		var pedalTypeIds = helpers.select(pedals, function (pedal) {
			return pedal.type;
		});
		
		var types = helpers.where(pedalDataAccess.types, function (type) {
			return pedalTypeIds.indexOf(type.id) !== -1;
		});
		
		return methods.getData(types, 
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
	};
	
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
	
	/* TODO: export to helper methods */
	function distinctColor(collection) {
		var distinctItems = [];
		var colors = [];
		helpers.forEach(collection, function (item) {
			if (colors.indexOf(item.color) === -1) {
				distinctItems.push(item);
				colors.push(item.color)
			}
		});
		return distinctItems;
	}
	
	methods.getColorData = function(pedals) {
		var pedalColors = helpers.select(pedals, function (pedal) {
			return roundColor(pedal.color);
		});
		
		var allColors = distinctColor(pedalColors);
		
		return methods.getData(allColors, 
			function (color) { return resources[color.name]; },/* getName */
			function (color) { /* getValue */ 
				return helpers.where(pedalColors, function (pedalColor) {
					return pedalColor.color === color.color;
				}).length; /* get the number of pedals on the board of this color */ 
			},
			function (color) { return "#" + color.color; }); /* getColor */
	};
	
	return methods;
});