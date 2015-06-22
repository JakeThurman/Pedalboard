define(["pedalBoardManager", "jquery", "mainPageMenuHandler", "pedalBoardStorage"], function (pedalBoardManager, $, mainPageMenuHandler, pedalBoardStorage) {
    var methods = {};
		
		methods.setup = function () {
        $(function () {
      	    //init dom vars
      	  	var mainContentContainer = $("#content-container");
      	  	var pageMenuButton = $("#page-main-menu");
      	  	var manager = pedalBoardManager.create();
      		
      		  pedalBoardStorage.Restore(manager, mainContentContainer);
      		
      	  	pageMenuButton.click(function () {			
      	  	    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager, function () { pedalBoardStorage.Save(manager); });
      	  	});
      	});
	  }
	
	  return methods;
});



