define(["jquery", "priceRenderer"], function ($, priceRenderer) {
	"use strict";
	
	var methods = {};
		
	methods.render = function (pedal) {	
		return $("<div>", { "class": "single-pedal-data" })
			.append($("<span>", { "class": "price" }).text("$" + priceRenderer.render(pedal.price)))
			.append($("<span>").text(" - " + pedal.fullName));
	};
		
	return methods;
});