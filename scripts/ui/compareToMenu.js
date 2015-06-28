define([ "_OptionMenu", "jquery", "textResources", "reportTypeMenu", "helperMethods" ], function (_OptionMenu, $, resources, reportTypeMenu, helpers) {
	"use strict";
	
	var methods = {};
	
	methods.create = function (boardId, link, manager, startCompare) {
		var options = $("<div>", { "class": "help-text no-hover" })
			.text(resources.compareToMenuHelpText);
				
		helpers.forEach(manager.GetBoards(), function (board) {
			/* only if it's not this board, and it has pedals */
			if (boardId === board.id || !manager.AnyPedals(board.id))
				return;
			
			/* create the element for it */
			var boardOption = $("<div>")
				.text(board.data.Name)
				.click(function () {
					reportTypeMenu.create(link, true, function (reportType) {
						startCompare(board.id, reportType);
					});
				});
			
			/* add it */
			options = options.add(boardOption);
		});
		
		/* if there is only one option, (2 including the help text), choose that option */
		if (options.length === 2)
			$(options[1]).click(); 
		else { /* otherwise just create the menu */
			 _OptionMenu.create(options, link)
				.click(function () {
					$(this).remove();
				});
		}
	};
	
	return methods;
});