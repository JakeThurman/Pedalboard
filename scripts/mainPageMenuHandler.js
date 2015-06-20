define(["textResources", "_OptionMenu", "jquery", "pedalBoardPopup"], function (resources, _OptionMenu, $, pedalBoardPopup) {
    var methods = {};
		
		/*
		 * @pageMenuButton:       the menu button that triggered this
		 * @mainContentContainer: the content container that the board should be appended to
		 * @callbacks:            object of callback functions
		 * 												    Params: @addBoard:    added a board
		 *																		@deleteBoard: deleted the board
		 *                                    @addPedal:    added a pedal to the board
		 *                                    @deletePedal: deleted a pedal from the board
		 *                                    @clearAll:    clear all created boards
		 *                                    @clear:       clear the created board
		 *																		@rename:      renamed the created board
		 */
		methods.handle = function(pageMenuButton, mainContentContainer, callbacks) {
		   		var addBoardButton = $("<div>")
    			    .text(resources.addPedalBoardButtonText)
      				.click(function () {
                  var newNameBox = $("<input>", { type: "text", placeholder: resources.newBoardNamePlaceholder })
    				
      						var menu = _OptionMenu.create(newNameBox).addClass("main-page-menu");
      						
									var addPedalBoardEvent = function () {
      						    var newName = newNameBox.val();
											
											//If they didn't even give us a name, don't bother creating a board
											if (!newName)
												 return;
											
											var newBoard = pedalBoardPopup.create(newName, mainContentContainer, callbacks);
											
											if (callbacks.addBoard)
											    callbacks.addBoard(newBoard);
											
											//we're done here!
											menu.remove();
      						};
									
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
      					  
      				    if (callbacks.clearAll)
									    callbacks.clearAll();
      				});
		
		    _OptionMenu.create(addBoardButton.add(clearAllBoards)).addClass("main-page-menu");
		};
		
    return methods;
});