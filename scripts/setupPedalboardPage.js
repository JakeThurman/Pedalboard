require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "historyPopup", "domReady!"], function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage, historyPopup) {
     //init dom vars
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	var manager = pedalBoardManager.create();
  
    pedalBoardStorage.Restore(manager, mainContentContainer);
  
   	pageMenuButton.click(function () {			
   	    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager, 
			function () { /* save action */
				pedalBoardStorage.Save(manager); 
			}, function () { /* open history action */
				var popup = historyPopup.create(manager.logger.changes);
				manager.AddChangeCallback(popup.addChange);
			});
    });
});



