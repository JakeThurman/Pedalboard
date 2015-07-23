require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "stateReverter", "historyPopup", "changeLogger", "batchTypes", "domReady!"], 
function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, stateReverter, historyPopup, changeLogger, batchTypes) {
    "use strict";
	
	/* DOM variables */
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	
	/* Data variables */
	var logger = changeLogger.create(pedalBoardStorage.GetHistory());
	var manager = pedalBoardManager.create(logger, mainContentContainer);
	
	/* Restore save data */
	function doImport() {
		manager.Import(pedalBoardStorage.Load());
	}
	
	if (pedalBoardStorage.HasSavedData()) /* We don't need to log that the page was reloaded! */
		logger.dontLog(doImport);
	else /* First load should be in a batch though */
		logger.batch(batchTypes.firstLoad, doImport);
	
	function revertTo(changeId) { /* Revert action */
		var changes = stateReverter.takeUntilId(changeId, 
			function () { /* Get Next Chnage */
				return logger.changes.pop(); /* Just pop the change because we're about to revert it anyway. */
			},
			function (change) { /* put change back -> once we find the change to revert to it puts that change back, becuase we don't want to revert it, only to it. */
				return logger.changes.push(change);
			});
		stateReverter.revert(changes, manager);
	}

	/* Setup the main page menu click handler */
   	pageMenuButton.click(function () {
   	    mainPageMenuHandler.handle(pageMenuButton, manager, 
			function () { /* save action */
				pedalBoardStorage.Save(manager.GetBoards(), logger.changes); 
			}, function () { /* open history action */
				var popup = historyPopup.create(logger.changes, revertTo);
				manager.AddChangeCallback(popup.addChange);
			});
    });
});



