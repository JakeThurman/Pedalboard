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
				var id; /*the id of the current board we are working with*/
								
				var addPedalBoard = function (domBoard) {
				    id = domBoard.options.id;
						boards[id] = { 
						    data: new classes.PedalBoard(), 
						    dom: domBoard 
					  };
						console.log("addBoard");
				};
				
				var deletePedalBoard = function(domBoard) {
				    delete boards[domBoard.options.id];
						console.log("deleteBoard");
				};
				
				var clearBoards = function () {
				    for(var key in boards) {
						    boards[key].dom.remove();
						    delete boards[key];
					  }
						console.log("clearAll");
				};
				
				var clearPedals = function () {
				    boards[id].data.Clear();
						console.log("clear");
				};
				
				var callBacks = {
				    addBoard: addPedalBoard,
						deleteBoard: deletePedalBoard,
						addPedal: function (pedal) { boards[id].data.AddPedal(pedal); console.log("addPedal"); },
						deletePedal: function (pedal) { boards[id].data.RemovePedal(pedal); console.log("deletePedal"); },
						clearAll: clearBoards,
						clear: clearPedals,
				};
				
		    mainPageMenuHandler.handle(pageMenuButton, mainContentContainer, callbacks, 
				boards.length > 0);
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



