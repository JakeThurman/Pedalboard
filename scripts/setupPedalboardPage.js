require(["PedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "StateReverter", "UndoHandler", "ChangeLogger", "batchTypes", "domReady!"], 
function (PedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, StateReverter, UndoHandler, ChangeLogger, batchTypes) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
	
	/* Reload from last save */
	var lastSaveData = pedalBoardStorage.Load();
	
	/* Data variables */
	var logger   = new ChangeLogger();
	var manager  = new PedalBoardManager(logger, mainContentContainer);
	var reverter = new StateReverter(manager, logger);
	var undoer   = new UndoHandler(reverter, logger, lastSaveData.undo);
	
	function save() {
		pedalBoardStorage.Save(logger.changes, undoer.getUndoneStack());
	}
	
	/* Restore save data */	
	reverter.replay(lastSaveData.history);
	
	/* This is the first load */
	if (!lastSaveData.history) {
		logger.batch(batchTypes.firstLoad, function () {
			manager.Import(pedalBoardStorage.GetDefaultBoard());
		});
	}
	
	/* Save on change */
	logger.addCallback(/* @waitForBatchCompletion: */ false, save);
	
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {
   	    mainPageMenuHandler.handle(manager, logger, undoer);
    });
	
	/* Setup ctrl+z undo/ctrl+y redo handler*/
	var zKey = 90, yKey = 89;
	
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
		}
	});
});
