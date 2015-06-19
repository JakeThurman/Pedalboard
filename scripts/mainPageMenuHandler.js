define(["textResources", "_OptionMenu", "jquery", "pedalBoardPopup"], function (resources, _OptionMenu, $, pedalBoardPopup) {
    var methods = {};
		
		methods.create = function(pageMenuButton, mainContentContainer, addBoardCallback) {
		   		var addBoardButton = $("<div>")
    			    .text(resources.addPedalBoardButtonText)
      				.click(function () {
                  var newNameBox = $("<input>", { type: "text", placeholder: resources.newBoardNamePlaceholder })
      				
      				    var addPedalBoardEvent = function () {
      						    var newName = newNameBox.val();
											
											var newBoard = pedalBoardPopup.create(newName, mainContentContainer);
											
											if (addBoardCallback)
											    addBoardCallback(newBoard);
      						};
      				
      						_OptionMenu.create(pageMenuButton, newNameBox);
      						
      						newNameBox.blur(addPedalBoardEvent)
      								.keyup(function (e) {
      								   if (e.keyCode == 13)//enter
      									     addPedalBoardEvent();									     
      								})
      								.focus();
      				});
      				
      	  var clearAllBoards = $("<div>")
      		    .text(resources.clearAllBoards)
      				.click(function () {
      				    if (!confirm(resources.clearAllBoardsConfirm))
      						    return;
      					  
      				    console.log("//TODO: add clear all logic")
      				});
		
		    _OptionMenu.create(pageMenuButton, addBoardButton.add(clearAllBoards));
		};
		
    return methods;
});