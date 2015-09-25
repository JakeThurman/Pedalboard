define([ "_OptionMenu", "jquery", "textResources", "stringReplacer", "reportTypeMenu", "helperMethods" ], function (_OptionMenu, $, resources, replacer, reportTypeMenu, helpers) {
	"use strict";
	
	var methods = {};
	
	/*
	 * Creats a menu with options for differnt boards to compare to
	 *
	 * PARAMS: 
	 *   @boardId:      (<?>)               The id of a pedalboard that is about to be compared
	 *   @link:         (jQuery)            The link to position the menu byte
	 *   @manager:      (PedalBoardManager) The pedalboard manager instance the board belongs to.
	 *   @startCompare: (function)          Calling this and passing in the chosen board's id and the chosen report type should start the report 
	 *
	 * @returns: The loaded menu
	 */
	methods.create = function (boardId, link, manager, startCompare) {
		var options = $("<div>", { "class": "help-text no-hover" })
			.text(resources.compareToMenuHelpText);
				
		helpers.forEach(manager.GetBoards(), function (board) {			
			/* Only if it's not this board */
			if (boardId === board.id)
				return;
			
			var boardHasPedals = manager.AnyPedals(board.id);
			
			/* create the element for it */
			var boardOption = $("<div>")
				.toggleClass(_OptionMenu.disabledClass, !boardHasPedals)
				.text(board.data.Name)
				.click(function () {
					if (boardHasPedals)
						reportTypeMenu.create(link, true, function (reportType) {
							startCompare(board.id, reportType);
						});
					else 
						_OptionMenu.message(replacer.replace(resources.boardHasNoPedals, board.data.Name), link);
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