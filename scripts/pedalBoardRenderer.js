//How to render a pedal board...
require(["helperMethods", "pedalDataAccess", "pedalBoardClasses", "pedalBoardPopup", "jquery"], function (helpers, Pedals, classes, pedalBoardPopup, $) {
	//On dom loaded....
	var boards = [];
	
	pedalBoardPopup.toAppendTo = $("#content-container");
	
	function addPedalBoard() {
		var newPedal = pedalBoardPopup.create("My Pedal Board");
	  boards.push(newPedal);
		newPedal.el.appendTo(document.body);
	}
	
	$(function () {
		addPedalBoard();
		$("#add-new-board").click(addPedalBoard);
		
		function addPedal(boardId) {
				var id = nextBoardId++;
				boardDOM[id] = createBoardDom(); 
				boardDATA[id] = new classes.PedalBoard();
		}
		
		function deletePedal(boardId, pedalId) {
		
		}
		
		function compare(boardIdA, boardIdB) {
		
		}
		
		function getBoard(boardId) {
        if (!boards[boardId])
        	 return;
				 
				var board
		}
		
  	//Refresh data
  	function legacyAddPedal(boardData, domBoard) {
  	   //Reset error display
  		 errorDisplay.text("");
  	
  		 //Record the new pedal!
  	   boardData.AddPedal(newPedal);
  		 
  		 //Show the user the new pedal
  		 addDomPedal(newPedal, domBoard);
  	}
		
		function addDomPedal(pedal, domBoard){	
				var pedalInfoContainer = helpers.createTextDiv("", "pedal-info", domBoard.get(0));
  								
  			pedalInfoContainer.appendChild(helpers.createTextDiv('$' + pedal.price)),
  			pedalInfoContainer.appendChild(helpers.createTextDiv(pedal.fullName || pedal.name)),
  			pedalInfoContainer.appendChild(helpers.createTextDiv('[' + pedal.type.name + ']')),
				
				domBoard.append($(pedalInfoContainer));
				
				renderBoardDiff();
		}
  
    function renderBoardDiff(boardA, boardB) {
		    if (!boardA && !boardB){
				   boardA = myBoardData;
					 boardB = plannedBoardData;
				}
		
  		  var neededDiff = boardA.RemoveOverlap(boardB);
  			var neededOutputDiv = $("#needed-output > .content");
    		appendOutput(neededDiff, neededOutputDiv);
  			
  			var canSellDiff = boardB.RemoveOverlap(boardA)
  			var canSellDiv = document.getElementById("can-sell-output");
				canSellDiv.innerHtml = "";
    		appendOutput(canSellDiff, canSellDiv);
    		
  			var otherOuputContainer = document.getElementById("other-output");
				otherOuputContainer.innerHtml = "";		
    		var otherOutputDiv = otherOuputContainer.appendChild(document.createElement("div"));
    		helpers.createTextDiv("Pedals Needed: " + neededDiff.pedals.length, otherOutputDiv);
        helpers.createTextDiv("New Pedals Cost: $" + neededDiff.TotalCost(), otherOutputDiv);
				
				function appendOutput(diff, parentNode){	
				    helpers.forEach(diff.pedals, function (pedal) {
        				var pedalInfoContainer = helpers.createTextDiv("", "pedal-info", parentNode);
          			
          			helpers.createTextDiv('$' + pedal.price, pedalInfoContainer);
          			helpers.createTextDiv(pedal.fullName || pedal.name, pedalInfoContainer);
          			helpers.createTextDiv('[' + pedal.type.name + ']', pedalInfoContainer);
					  });
    		}
    }
	});
});



