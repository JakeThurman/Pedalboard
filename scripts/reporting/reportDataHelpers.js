define([ "helperMethods" ], function (helpers) {
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
	
	return methods;
});