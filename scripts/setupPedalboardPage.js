require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "stateReverter", "undoHandler", "historyPopup", "changeLogger", "batchTypes", "domReady!"], 
function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, stateReverter, undoHandler, historyPopup, changeLogger, batchTypes) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	
	/* Data variables */
	var logger = changeLogger.create(pedalBoardStorage.Load());
	var manager = pedalBoardManager.create(logger, mainContentContainer);
	var undoer = undoHandler.create(manager, logger);
	
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
	var zKey = 90, yKey = 89, sKey = 83;
	
	$(document).keydown(function(e) {
		if (!e.ctrlKey)
			return;
		switch (e.keyCode) {
			case zKey:
				undoer.undo();
				return false;
				
			case yKey:
				undoer.redo();
				return false;
				
			case sKey:
				save();
				return false;
		}
	});
});
