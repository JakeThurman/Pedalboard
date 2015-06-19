//How to render a pedal board...
require(["helperMethods", "pedalDataAccess", "pedalBoardClasses", "pedalBoardPopup", "jquery", "textResources", "mainPageMenuHandler"], function (helpers, Pedals, classes, pedalBoardPopup, $, resources, mainPageMenuHandler) {
	//On dom loaded....
	var boards = [];
	
	var mainContentContainer;
	
	function addPedalBoard(name) {
	    var newPedal = pedalBoardPopup.create(name, mainContentContainer);
	    boards.push(newPedal);
	    newPedal.el.appendTo(document.body);
	}
	
	$(function () {
		//set this up so we don't need to pass it arround as much
		mainContentContainer = $("#content-container");
	
	  //Add a default pedalboard to start
		addPedalBoard(resources.defaultPedalBoardName);
		
		var pageMenuButton = $("#page-main-menu");
		
		pageMenuButton.click(function () {
		    mainPageMenuHandler.create(pageMenuButton, mainContentContainer);
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



