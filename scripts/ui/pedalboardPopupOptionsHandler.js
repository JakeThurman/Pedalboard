define(["_OptionMenu", "jquery", "textResources", "reportTypeMenu", "compareToMenu"], function (_OptionMenu, $, resources, reportTypeMenu, compareToMenu) {
   "use strict";

	var methods = {};

	/*
	 *  @id:                the id of the board,
	 *  @menubutton:        $object of the menu button,
	 *  @manager:           the pedalBoardManager.js instance to add the pedal to.
	 *  @addPedals:         calling this function should open an addPedalsMenu modal
	 *  @startReport:       calling this function should start a report on it with the given type paramCompare
	 *  @startCompare:      calling this function should start a comparative report of the given type against board with the given boardId
	 */
	methods.handle = function (id, menuButton, manager, addPedals, startReport, startCompare) {	
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
			.text(resources.clearPedalsFromBoard)
			.click(function () {
				if (confirm(resources.clearPedalsFromBoardConfirm))
					manager.Clear(id);
			});
		
		var reportButton = $("<div>", { "class": "section-top" })
			.text(resources.boardReportButton)
			.click(function () {
				reportTypeMenu.create(menuButton, false, startReport);
			});
				
		var compareButton = $("<div>")
			.text(resources.boardCompareButton)
			.click(function () {
				compareToMenu.create(id, menuButton, manager, startCompare);
			});;
		
		/* ! Setting up which options are valid and adding them ! */
		var addSection = $("<div>", { "class": "section" })
			.append(addPedal);
		
		/* report section */
		var reportSection = $("<div>", { "class": "section" });
		var useReportSection = false;
		
		if (manager.MultiplePedals(id)) {
			reportButton.appendTo(reportSection);
			useReportSection = true;
		}
		/* if this board has any pedals, and there are multiple boards with any pedals, add the compare button */
		if (manager.AnyPedals(id) && manager.Multiple(function (pedalboard) { return manager.AnyPedals(pedalboard.id) })) {
			compareButton.appendTo(reportSection);
			useReportSection = true;
		}
		
		/* delete section */
		var deleteSection = $("<div>", { "class": "section" });
		
		if (manager.AnyPedals(id))
			clearLink.appendTo(deleteSection);
		
		deleteLink.appendTo(deleteSection);
				
		/* create the actual menu with this content */	
		var options = useReportSection
			? addSection.add(reportSection).add(deleteSection)
			: addSection.add(deleteSection);
		
		return _OptionMenu.create(options, menuButton)
			.click(function () {
				$(this).remove();
			});
    }
		
	return methods;
});