define(["textResources", "_OptionMenu", "jquery", "pedalBoardPopup"], function (resources, _OptionMenu, $, pedalBoardPopup) {
    var methods = {};
		
		/*
		 * @pageMenuButton:       the menu button that triggered this
		 * @mainContentContainer: the content container that the board should be appended to
		 * @callbacks:            object of callback functions
		 * 												    Params: @addBoard:    added a board                       | (domBoard)
		 *																		@deleteBoard: deleted the board                   | (boardId)
		 *                                    @deleteAll:   delete all created boards           | ()
		 *                                    @addPedal:    added a pedal to the board          | (pedal, boardId)
		 *                                    @deletePedal: deleted a pedal from the board      | (pedalId, boardId)
		 *                                    @clear:       clear the created board             | (boardId) 
		 *																		@rename:      renamed the created board           | (name, boardId)
		 * @helpActions:          an object of help functions.
		 *                            Params: @anyBoards:   are there any pedal boards?         | ()
		 *                                    @anyPedals:   are there any pedals on this board? | (boardId)
		 */
		methods.handle = function(pageMenuButton, mainContentContainer, callbacks, helpActions) {
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
											
											var newBoard = pedalBoardPopup.create(newName, mainContentContainer, callbacks, helpActions);
											
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
      					  									
      				    if (callbacks.deleteAll)
									    callbacks.deleteAll();
      				});
							
				  var options = helpActions.anyBoards() 
							? addBoardButton.add(clearAllBoards) 
							: addBoardButton;
					
		      _OptionMenu.create(options).addClass("main-page-menu");
		};
		
    return methods;
});