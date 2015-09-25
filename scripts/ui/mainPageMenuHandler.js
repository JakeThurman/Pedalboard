define(["textResources", "_OptionMenu", "jquery"], function (resources, _OptionMenu, $) {
	"use strict";
    var methods = {};
		
	/*
	 * Handles click events to the main page menu icon
	 * 
	 * PARAMS:
	 *   @manager:          (PedalBoardManager) The pedalBoardManager instance to manage pedal boards with
	 *   @logger:           (ChangeLogger)      The change logger instance used with the manager
	 *   @undoer:           (UndoHandler)       An undoHandler instance
	 *   @openTutorial:     (function)          Calling this should open the tutorial popup (or close it if it is open)
	 *   @openHistoryPopup: (function)          Calling this should open the history popup (or close it if it is open)
	 *
	 * @returns: The loaded menu
	 */
	methods.handle = function(manager, logger, undoer, openTutorial, openHistoryPopup) {
		
		/* Gather data up front */
		var isAnyBoards = manager.Any();
		var canUndo = undoer.canUndo();
		var canRedo = undoer.canRedo();
		
		/* Start creating the button elements */
		var addBoardButton = $("<div>")
			.text(resources.addPedalBoardButtonText)
			.click(function () {
				var newNameBox = $("<input>", { type: "text", "class": "no-hover", placeholder: resources.newBoardNamePlaceholder });

				var nameMenu = _OptionMenu.create(newNameBox).addClass("main-page-menu");

				var addPedalBoardEvent = function () {
					var name = newNameBox.val();
					/* If they didn't even give us a name, don't bother creating a board */
					if (!name)
						return;

					manager.Add(name);
					/* we're done here! */
					nameMenu.remove();
				};

				newNameBox.blur(addPedalBoardEvent)
					.click(addPedalBoardEvent)
					.keyup(function (e) {
						if (e.keyCode == 13)/* enter */
							addPedalBoardEvent();   
					})
					.focus();
			});
			
		var addBoardSection = $("<div>", { "class": "section" })
			.append(addBoardButton);
				
		var deleteAllBoards = $("<div>")
			.toggleClass(_OptionMenu.disabledClass, !isAnyBoards)
			.text(resources.clearAllBoards)
			.click(function () {
				if (isAnyBoards) {
					if (confirm(resources.clearAllBoardsConfirm))
						manager.DeleteAll();
				} else {
					_OptionMenu.message(resources.thereAreNoBoardsToDelete);
				}
			});

		var deleteAllSection = $("<div>", { "class": "section" })
			.append(deleteAllBoards);
			
		var historyButton = $("<div>")
			.text(resources.historyPopupTitle)
			.click(openHistoryPopup);
		
		var undoButton = $("<div>")
			.toggleClass(_OptionMenu.disabledClass, !canUndo)
			.text(resources.undoLastChange)
			.click(function () {
				if (canUndo)
					undoer.undo();
				else
					_OptionMenu.message(resources.noChangesToUndo);
			});
			
		var redoButton = $("<div>")
			.toggleClass(_OptionMenu.disabledClass, !canRedo)
			.text(resources.redoLastUndo)
			.click(function () {
				if (canRedo)
					undoer.redo();
				else
					_OptionMenu.message(resources.noUndoneChangesToRedo);
			});
					
		var historySection = $("<div>", { "class": "section" })
			.append(undoButton)
			.append(redoButton)
			.append(historyButton);

		var menuOptions = addBoardSection
			.add(historySection)
			.add(deleteAllSection);
		
		return _OptionMenu.create(menuOptions)
			.addClass("main-page-menu fixed");
	};
		
    return methods;
});