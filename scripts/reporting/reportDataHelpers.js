define([ "helperMethods" ], function (helpers) {
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
	
	methods.getData = function(pedals, getName, getValue, getColor) {
		var output = [];
		helpers.forEach(pedals, function (pedal) {
			var color = getColor(pedal);
			output.push({
				value: getValue(pedal),
				label: getName(pedal),
				color: color,
				highlight: highlightColor(color, 0.1), /*10% lighter*/
			});
		});
		return output;
	};
	
	methods.getPriceData = function(pedals) {
		return methods.getData(pedals, 
			function (pedal) { return pedal.name; },
			function (pedal) { return pedal.price; }, 
			function (pedal) { return pedal.color; });
	};
	
	return methods;
});