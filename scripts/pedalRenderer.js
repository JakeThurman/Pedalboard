define(["jquery",], function ($) {
    var methods = {};
		
		methods.getId = function (domPedal) {
        return domPedal.data("id");
    }
		
		/*
		 * @manager: the instance of pedalManager.js to render pedals for
		 */
		methods.create = function (manager) {
		    var renderer = {};
				
				renderer.getId = methods.getId;
		
		    /*
    		 * @pedal:    a {pedalClasses.js}.pedal object to render
    		 * @returns   $(redered-pedal)
    		 */
    		renderer.render = function (pedal) {		
    		    return $("<div>", { "class": "single-pedal-data" })
    						.data("id", pedal.id)
                .append($("<span>", { "class": "price" }).text("$" + pedal.price))
    						.append($("<span>").text(" - " + pedal.fullName));
    		};
				
				return renderer;
		};
		
		return methods;
});