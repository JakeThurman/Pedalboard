define([ "_OptionMenu", "jquery" ], function (_OptionMenu, $) {
	"use strict";
	
	var methods = {};
	
	methods.create = function (link, startAction) {
		var option = $("<div>")
			.click(function () {
				startAction();
			});
		
		return _OptionMenu.create(option, link)
	};
	
	return methods;
});