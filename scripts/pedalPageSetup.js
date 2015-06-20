//How to render a pedal board...
require(["helperMethods", "pedalDataAccess", "pedalBoardClasses", "pedalBoardManager", "jquery", "textResources", "mainPageMenuHandler"], function (helpers, Pedals, classes, pedalBoardManager, $, resources, mainPageMenuHandler) {
	$(function () {
	  //init dom vars
		var mainContentContainer = $("#content-container");
		var pageMenuButton = $("#page-main-menu");
				
		/*Create a button handler and give it the needed events.*/
		pageMenuButton.click(function () {
  			
				/*Wrap the manager for the callbacks*/
				var callbacks = {
				    addBoard: function (domBoard) { 
						    pedalBoardManager.Add(domBoard); 
						},
						rename: function (name, boardId) {
						    pedalBoardManager.Rename(name, boardId)
						},
						deleteBoard: function(boardId) { 
						    pedalBoardManager.Delete(boardId); 
						},
						deleteAll: function () {
						    pedalBoardManager.DeleteAll(); 
						},
						addPedal: function (pedal, boardId) { 
						   pedalBoardManager.AddPedal(pedal, boardId); 
						},
						deletePedal: function (pedalId, boardId) { 
						    pedalBoardManager.RemovePedal(pedalId, boardId); 
						},
						clear: function (boardId) { 
						    pedalBoardManager.Clear(boardId); 
				    },
				};
				var helpActions = {
				    anyBoards: function () { 
						    return pedalBoardManager.Any(); 
						},
						anyPedals: function (boardId) { 
						    return pedalBoardManager.AnyPedals(boardId);
						},
				};
				
		    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, callbacks, helpActions);
		});
		
		function addPedal(boardId) {
				var id = nextBoardId++;
				boardDOM[id] = createBoardDom(); 
				boardDATA[id] = new classes.PedalBoard();
		}
		
		function deletePedal(boardId, pedalId) {
		
		}
		
		function compare(boardIdA, boardIdB) {
		
		}
	});
});



