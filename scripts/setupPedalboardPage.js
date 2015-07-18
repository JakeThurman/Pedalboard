require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "historyPopup", "changeLogger", "textResources", "domReady!"], function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, historyPopup, changeLogger, resources) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	
	/* Data variables */
	var logger = changeLogger.create(pedalBoardStorage.GetHistory());
	var manager = pedalBoardManager.create(logger);
	
	/* Restore save data */
	function doImport() {
		manager.Import(pedalBoardStorage.Load(), mainContentContainer);
	}
	
	/* We don't need to log that the page was reloaded! First load should be in a batch though */
	if (pedalBoardStorage.HasSavedData())
		logger.dontLog(doImport);
	else
		logger.batch(resources.firstStartupBatchName, doImport);
		
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {			
   	    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager, 
			function () { /* save action */
				pedalBoardStorage.Save(manager.GetBoards(), logger.changes); 
			}, function () { /* open history action */
				var popup = historyPopup.create(logger.changes);
				manager.AddChangeCallback(popup.addChange);
			});
    });
});



