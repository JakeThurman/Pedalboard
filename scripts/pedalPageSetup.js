//How to render a pedal board...
require(["pedalBoardManager", "jquery", "mainPageMenuHandler"], function (pedalBoardManager, $, mainPageMenuHandler) {
	$(function () {
	  //init dom vars
		var mainContentContainer = $("#content-container");
		var pageMenuButton = $("#page-main-menu");
				
		/*Wrap the manager for the callbacks*/
		var callbacks = {
		    addBoard: function (domBoard) { pedalBoardManager.Add(domBoard); },
				rename: function (name, boardId) { pedalBoardManager.Rename(name, boardId) },
				deleteBoard: function(boardId) { pedalBoardManager.Delete(boardId); },
				deleteAll: function () { pedalBoardManager.DeleteAll(); },
				addPedal: function (pedal, boardId) { pedalBoardManager.AddPedal(pedal, boardId); },
				deletePedal: function (pedalId, boardId) { pedalBoardManager.RemovePedal(pedalId, boardId); },
				clear: function (boardId) { pedalBoardManager.Clear(boardId); },
		};
		var helpActions = {
		    anyBoards: function () { return pedalBoardManager.Any(); },
				anyPedals: function (boardId) { return pedalBoardManager.AnyPedals(boardId); },
		};
				
		/*Create a button handler and give it the needed events.*/
		pageMenuButton.click(function () {			
		    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, callbacks, helpActions);
		});
	});
});



