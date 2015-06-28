define(["_OptionMenu", "jquery", "addPedalMenu", "textResources", "reportTypeMenu", "compareToMenu"], function (_OptionMenu, $, addPedalMenu, resources, reportTypeMenu, compareToMenu) {
    var methods = {};

	/*
	 *  @id:                the id of the board,
	 *  @menubutton:        $object of the menu button,
	 *  @pedalContainer:    the container to append new pedals,
	 *  @manager:           the pedalBoardManager.js instance to add the pedal to.
	 *  @startReport:       calling this function should start a report on it with the given type paramCompare
	 *  @startCompare:      calling this function should start a comparative report of the given type against board with the given boardId
	 */
	methods.handle = function (id, menuButton, pedalContainer, manager, startReport, startCompare) {	
		var deleteLink = $("<div>")
			.text(resources.deletePedalBoard)
			.click(function () {
				if (confirm(resources.singleBoardDeleteConfirm))
					manager.Delete(id);
			});
		
		var addPedal = $("<div>")
			.text(resources.addPedalToBoard)
			.click(function () {
				addPedalMenu.create(menuButton, function (pedal) {
					manager.AddPedal(pedal, id, pedalContainer);
				});
			});
				
		var clearLink = $("<div>")
			.text(resources.clearPedalsFromBoard)
			.click(function () {
				if (confirm(resources.clearPedalsFromBoardConfirm))
					manager.Clear(id);
			});
		
		/* These buttons ARE dead code, but are still here to be placeholders for the coming report feature  */
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
		/* if there are multiple boards with any pedals, add the compare button */
		if (manager.Multiple(function (pedalboard) { return manager.AnyPedals(pedalboard.id) }))
			compareButton.appendTo(reportSection);
		
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