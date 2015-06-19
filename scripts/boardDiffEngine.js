define(["pedalBoardClasses"], function (classes) {
    var methods = {};
		
		methods.asText = function(boardA, boardB) {
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
    };
		
		return methods;
});