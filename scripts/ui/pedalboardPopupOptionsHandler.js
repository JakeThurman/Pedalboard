define(["_OptionMenu", "jquery", "addPedalMenu", "textResources"], function (_OptionMenu, $, addPedalMenu, resources) {
    var methods = {};

	/*
	 *  @id:                the id of the board,
	 *  @menubutton:        $object of the menu button,
	 *  @pedalContainer:    the container to append new pedals,
	 *  @manager:           the pedalBoardManager.js instance to add the pedal to.
	 */
	methods.handle = function (id, menuButton, pedalContainer, manager) {	
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
		var reportButton = $("<div>")
			.text(resources.boardReportButton);
				
		var compareButton = $("<div>")
			.text(resources.boardCompareButton);
				
		/* We can't clear a board with no pedals... */
		var options = manager.AnyPedals(id) 
			? addPedal.add(clearLink).add(deleteLink)
			: addPedal.add(deleteLink);
		
		_OptionMenu.create(options, menuButton);
    }
		
	return methods;
});