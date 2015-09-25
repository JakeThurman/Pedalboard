define(["_OptionMenu", "jquery", "textResources", "reportTypeMenu", "compareToMenu"], function (_OptionMenu, $, resources, reportTypeMenu, compareToMenu) {
   "use strict";

	var methods = {};

	/*
	 * Handles click events to the pedalboard popups option menu icon
	 *  
	 * PARAMS:
	 *   @id:           The id of the board,
	 *   @menubutton:   $object of the menu button,
	 *   @manager:      The pedalBoardManager.js instance to add the pedal to.
	 *   @addPedals:    Calling this function should open an addPedalsMenu modal
	 *   @startReport:  Calling this function should start a report on it with the given type paramCompare
	 *   @startCompare: Calling this function should start a comparative report of the given type against board with the given boardId
	 *
	 * @returns: The loaded menu
	 */
	methods.handle = function (id, menuButton, manager, addPedals, startReport, startCompare) {
		
		/* Get data variables from manager */
		var isMultiplePedalsOnThisBoard = manager.MultiplePedals(id);
		var isAnyPedalsOnThisBoard = manager.AnyPedals(id);
		var isMultipleBoards = manager.Multiple();
		var isMultipleBoardsWithPedals = manager.Multiple(function (pedalboard) { return manager.AnyPedals(pedalboard.id); });
		
		var deleteLink = $("<div>")
			.text(resources.deletePedalBoard)
			.click(function () {
				if (confirm(resources.singleBoardDeleteConfirm))
					manager.Delete(id);
			});
		
		var addPedal = $("<div>")
			.text(resources.addPedalToBoard)
			.click(addPedals);
				
		var clearLink = $("<div>")
			.toggleClass(_OptionMenu.disabledClass, !isAnyPedalsOnThisBoard)
			.text(resources.clearPedalsFromBoard)
			.click(function () {
				if (isAnyPedalsOnThisBoard){
					if (confirm(resources.clearPedalsFromBoardConfirm))
						manager.Clear(id);
				} else {
					_OptionMenu.message(resources.clearThisBoardHasNoPedals, menuButton);
				}
			});
		
		var reportButton = $("<div>", { "class": "section-top" })
			.toggleClass(_OptionMenu.disabledClass, !isMultiplePedalsOnThisBoard)
			.text(resources.boardReportButton)
			.click(function () {
				if (isMultiplePedalsOnThisBoard)
					reportTypeMenu.create(menuButton, false, startReport);
				else
					_OptionMenu.message(resources.multiplePedalsToReport, menuButton);
			});
				
		var enableCompare = isAnyPedalsOnThisBoard && isMultipleBoardsWithPedals;
				
		var compareButton = $("<div>")
			.toggleClass(_OptionMenu.disabledClass, !enableCompare)
			.text(resources.boardCompareButton)
			.click(function () {
				if (enableCompare) {
					compareToMenu.create(id, menuButton, manager, startCompare);
				} else {
					var text = !isAnyPedalsOnThisBoard
						? resources.compareThisBoardHasNoPedals
						: !isMultipleBoardsWithPedals && isMultipleBoards
							? resources.compareNoOtherBoardsWithPedals
							: resources.compareNoOtherBoards;
					
					_OptionMenu.message(text, menuButton);
				}
			});
		
		/* ! Setting up which options are valid and adding them ! */
		var addSection = $("<div>", { "class": "section" })
			.append(addPedal);
		
		/* report section */
		var reportSection = $("<div>", { "class": "section" })
			.append(reportButton)
			.append(compareButton);
			
		/* delete section */
		var deleteSection = $("<div>", { "class": "section" })
			.append(clearLink)
			.append(deleteSection);
		
		deleteLink.appendTo(deleteSection);
				
		/* create the actual menu with this content */	
		var options = addSection.add(reportSection).add(deleteSection)
		
		return _OptionMenu.create(options, menuButton)
			.click(function () {
				$(this).remove();
			});
    };
		
	return methods;
});