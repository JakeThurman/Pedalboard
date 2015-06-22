require(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage", "domReady!"], function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage) {
     //init dom vars
   	var mainContentContainer = $("#content-container");
   	var pageMenuButton = $("#page-main-menu");
   	var manager = pedalBoardManager.create();
  
    pedalBoardStorage.Restore(manager, mainContentContainer);
  
   	pageMenuButton.click(function () {			
   	    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager, function () { pedalBoardStorage.Save(manager); });
    });
});



