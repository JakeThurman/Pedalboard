define([ "_OptionMenu", "jquery", "textResources" ], function (_OptionMenu, $, resources) {
	"use strict";
	
	var methods = {};
	
	methods.create = function (link, startAction) {
		var option = $("<div>", { "class": "help-text no-hover" })
			.text(resources.reportInWhatWayHelpText);;
		
		return _OptionMenu.create(option, link)
			.click(function () {
				$(this).remove();
			});
	};
	
	return methods;
});