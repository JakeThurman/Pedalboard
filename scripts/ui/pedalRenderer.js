define(["jquery", "priceRenderer"], function ($, priceRenderer) {
	"use strict";
	
	var methods = {};
		
	methods.render = function (pedal) {	
		return $("<div>", { "class": "single-pedal-data" })
			.data("id", pedal.id)
			.append($("<span>", { "class": "price" }).text("$" + priceRenderer.render(pedal.price)))
			.append($("<span>").text(" - " + pedal.fullName));
	};
		
	methods.getId = function (domPedal) {
		return domPedal.data("id");
	};
		
	return methods;
});