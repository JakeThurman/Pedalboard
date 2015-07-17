require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "historyPopup", "changeLogger", "textResources", "domReady!"], function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, historyPopup, changeLogger, resources) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	
	/* Data variables */
	var logger = changeLogger.create();
	var manager = pedalBoardManager.create(logger);
	
	/* Restore save data */
	logger.batch(resources.restoreBatchName, function () {
		manager.Import(pedalBoardStorage.Load(), mainContentContainer);
	});
	
	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {			
   	    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager, 
			function () { /* save action */
				pedalBoardStorage.Save(manager); 
			}, function () { /* open history action */
				var popup = historyPopup.create(logger.changes);
				manager.AddChangeCallback(popup.addChange);
			});
    });
});



