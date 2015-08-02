require(["PedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "StateReverter", "UndoHandler", "ChangeLogger", "batchTypes", "objectTypes", "domReady!"], 
function (PedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, StateReverter, UndoHandler, ChangeLogger, batchTypes, objectTypes) {
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
	
	/* Restore save data */	
	/* Temporarily disable calling back async for the restore calls so we can avoid errors like the redo stack getting cleared */
	logger.CALLBACK_ASYNC = false;
	reverter.replay(lastSaveData.history);
	logger.CALLBACK_ASYNC = true;
	
	/* Setup the undo handler AFTER replay to avoid clearing the redo stack */
	var undoer   = new UndoHandler(reverter, logger, lastSaveData.undo);
	
	/* This is the first load */
	if (!lastSaveData.history) {
		logger.batch(batchTypes.firstLoad, objectTypes.pedalboard, function () {
			manager.Import(pedalBoardStorage.GetDefaultBoard());
		});
	}
	
	/* Save on change */
	logger.addCallback(/* @waitForBatchCompletion: */ false, function () {
		pedalBoardStorage.Save(logger.changes, undoer.getUndoneStack());
	});
	
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
