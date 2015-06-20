//How to render a pedal board...
require(["helperMethods", "pedalDataAccess", "pedalBoardClasses", "pedalBoardPopup", "jquery", "textResources", "mainPageMenuHandler"], function (helpers, Pedals, classes, pedalBoardPopup, $, resources, mainPageMenuHandler) {
	$(function () {
	  //init dom vars
		var mainContentContainer = $("#content-container");
		var pageMenuButton = $("#page-main-menu");
		
		//init other vars
		var boards = {};
		
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
				
		    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, {
				    addBoard: addPedalBoard,
						deleteBoard: deletePedalBoard,
						addPedal: function (pedal) { thisBoard.AddPedal(pedal); },
						deletePedal: function (pedal) { thisBoard.RemovePedal(pedal); },
				});
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



