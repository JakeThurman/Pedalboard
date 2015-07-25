require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "stateReverter", "historyPopup", "changeLogger", "batchTypes", "domReady!"], 
function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, stateReverter, historyPopup, changeLogger, batchTypes) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	
	/* Data variables */
	var logger = changeLogger.create(pedalBoardStorage.Load());
	var manager = pedalBoardManager.create(logger, mainContentContainer);
	
	/* Restore save data */	
	if (pedalBoardStorage.HasSavedData()) /* We don't need to log that the page was reloaded! */
		logger.dontLog(function () {
			stateReverter.replay(logger.changes, manager);
		});
	else /* First load should be in a batch though */
		logger.batch(batchTypes.firstLoad, function () {
			manager.Import(pedalBoardStorage.GetDefaultBoard());
		});
		
	function save() { 
		pedalBoardStorage.Save(logger.changes); 
	}
	
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {
   	    mainPageMenuHandler.handle(pageMenuButton, manager, save,
			function () { /* open history action */
				var popup = historyPopup.create(logger.changes);
				manager.AddChangeCallback(popup.addChange);
			});
    });
	
	/* Setup ctrl+z undo handler, and ctrl+s save handler */
	var lastUndoOperations = 0;
	var undoInProgress = false;
	manager.AddChangeCallback(function () {
		if (!undoInProgress)
			lastUndoOperations = 0;
	});
	
	var zKey = 90, yKey = 89, sKey = 83;

	$(document).keydown(function(e) {
		if (!e.ctrlKey)
			return;
		switch (e.keyCode) {
			case zKey:
				undoInProgress = true;
				stateReverter.revert(logger.changes[logger.changes.length - (1 + lastUndoOperations)], manager);
				undoInProgress = false;
				/* Count two. One to say we undid this change, one for the change that was added by the undo opperation itself */
				lastUndoOperations++;
				lastUndoOperations++;
				return false;
				
			case sKey:
				save();
				return false;
		}
	});
});
