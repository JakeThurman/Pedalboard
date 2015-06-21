define(["textResources", "_OptionMenu", "jquery"], function (resources, _OptionMenu, $) {
    var methods = {};
		
		/*
		 * @pageMenuButton:       the menu button that triggered this
		 * @mainContentContainer: the content container that the board should be appended to
		 * @manager:              pedalBoardManager.js object to manage pedal boards with
		 */
		methods.handle = function(pageMenuButton, mainContentContainer, manager) {
		   		var addBoardButton = $("<div>")
    			    .text(resources.addPedalBoardButtonText)
      				.click(function () {
                  var newNameBox = $("<input>", { type: "text", placeholder: resources.newBoardNamePlaceholder })
    				
      						var nameMenu = _OptionMenu.create(newNameBox).addClass("main-page-menu");
      						
									var addPedalBoardEvent = function () {
      						    var newName = newNameBox.val();
											/* If they didn't even give us a name, don't bother creating a board */
											if (!newName)
												 return;
											
									    manager.Add(newName, mainContentContainer);
											/* we're done here! */
											nameMenu.remove();
      						};
									
      						newNameBox.blur(addPedalBoardEvent)
									    .click(addPedalBoardEvent)
      								.keyup(function (e) {
      								   if (e.keyCode == 13)/* enter */
      									     addPedalBoardEvent();   
      								})
      								.focus();
      				});
      				
      	  var deleteAllBoards = $("<div>")
      		    .text(resources.clearAllBoards)
      				.click(function () {
      				    if (confirm(resources.clearAllBoardsConfirm))
									    manager.DeleteAll();
      				});
							
				  var menuOptions = manager.Any() 
							? addBoardButton.add(deleteAllBoards) 
							: addBoardButton;
					
		      _OptionMenu.create(menuOptions).addClass("main-page-menu");
		};
		
    return methods;
});