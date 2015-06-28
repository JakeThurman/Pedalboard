define([ "_OptionMenu", "jquery", "textResources", "reportTypes" ], function (_OptionMenu, $, resources, reportTypes) {
	"use strict";
	
	var methods = {};
	
	methods.create = function (link, isCompare, startAction) {
		var options = $("<div>", { "class": "help-text no-hover" })
			.text(resources.reportInWhatWayHelpText);;
		
		var isKey = isCompare ? "forCompare": "forReport";
		
		for(var key in reportTypes) {
			var type = reportTypes[key];
			
			if (!type[isKey])
				continue;
			
			var newOption = $("<div>").text(resources[type.resource])
				.click(function () {
					startAction(type);
				});
			
			options = options.add(newOption);
		}
		
		return _OptionMenu.create(options, link)
			.click(function () {
				$(this).remove();
			});
	};
	
	return methods;
});