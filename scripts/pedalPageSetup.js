//How to render a pedal board...
require(["pedalBoardManager", "jquery", "mainPageMenuHandler"], function (pedalBoardManager, $, mainPageMenuHandler) {
	$(function () {
	  //init dom vars
		var mainContentContainer = $("#content-container");
		var pageMenuButton = $("#page-main-menu");
		var manager = pedalBoardManager.create();
		
		pageMenuButton.click(function () {			
		    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, manager);
		});
	});
});



