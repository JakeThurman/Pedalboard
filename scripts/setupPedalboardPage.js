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
	
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {
   	    mainPageMenuHandler.handle(pageMenuButton, manager, 
			function () { /* save action */
				pedalBoardStorage.Save(logger.changes); 
			}, function () { /* open history action */
				var popup = historyPopup.create(logger.changes);
				manager.AddChangeCallback(popup.addChange);
			});
    });
	
	/* Setup ctrl+z undo handler */
	var lastUndoOperations = 0;
	var undoInProgress = false;
	manager.AddChangeCallback(function () {
		if (!undoInProgress)
			lastUndoOperations = 0;
	});
	
	var zKey = 90, yKey = 89;

	$(document).keydown(function(e) {
		if (e.ctrlKey && e.keyCode == zKey) {
			undoInProgress = true;
			stateReverter.revert(logger.changes[logger.changes.length - (1 + lastUndoOperations)], manager);
			undoInProgress = false;
			/* Count two. One to say we undid this change, one to say */
			lastUndoOperations++;
			lastUndoOperations++;
		}
	});
});
