define(["textResources", "_OptionMenu", "jquery", "pedalBoardPopup"], function (resources, _OptionMenu, $, pedalBoardPopup) {
    var methods = {};
		
		methods.create = function(pageMenuButton, mainContentContainer, addBoardCallback, deleteBoardCallback, addPedalCallback, deletePedalCallback) {
		   		var addBoardButton = $("<div>")
    			    .text(resources.addPedalBoardButtonText)
      				.click(function () {
                  var newNameBox = $("<input>", { type: "text", placeholder: resources.newBoardNamePlaceholder })
      				
      				    var addPedalBoardEvent = function () {
      						    var newName = newNameBox.val();
											
											//If they didn't even give us a name, don't bother creating a board
											if (!newName)
												 return;
											
											var newBoard = pedalBoardPopup.create(newName, mainContentContainer, addBoardCallback, addPedalCallback, deletePedalCallback, deleteBoardCallback);
											
											if (addBoardCallback)
											    addBoardCallback(newBoard);
      						};
      				
      						_OptionMenu.create(newNameBox).addClass("main-page-menu");
      						
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
		
		    _OptionMenu.create(addBoardButton.add(clearAllBoards)).addClass("main-page-menu");
		};
		
    return methods;
});