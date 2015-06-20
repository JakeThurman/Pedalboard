//How to render a pedal board...
require(["helperMethods", "pedalDataAccess", "pedalBoardClasses", "pedalBoardPopup", "jquery", "textResources", "mainPageMenuHandler"], function (helpers, Pedals, classes, pedalBoardPopup, $, resources, mainPageMenuHandler) {
	$(function () {
	  //init dom vars
		var mainContentContainer = $("#content-container");
		var pageMenuButton = $("#page-main-menu");
		
		//init other vars
		var boards = {};

	  //Add a default pedalboard to start
		addPedalBoard(pedalBoardPopup.create(resources.defaultPedalBoardName, mainContentContainer));
		
		//Create a button handler and give it the needed events.
		pageMenuButton.click(function () {
				var thisBoard;
								
				var addPedalBoard = function (domBoard) {
						thisBoard = new classes.PedalBoard();
						boards[domBoard.options.id] = thisBoard;
				};
				
				var deletePedalBoard = function(domBoard) {
				    delete boards[domBoard.options.id];
				};
				
				//Pedal add and delete event propagators
				var addPedal = function (pedal) { thisBoard.AddPedal(pedal); };
				var deletePedal = function (pedal) { thisBoard.RemovePedal(pedal); }; 
				
		    mainPageMenuHandler.create(pageMenuButton, mainContentContainer, addPedalBoard, deletePedalBoard, addPedal, deletePedal);
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



