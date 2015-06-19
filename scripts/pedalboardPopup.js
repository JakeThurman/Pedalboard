define(["_Popup", "addPedalPopup", "_OptionMenu", "jquery", "textResources"], function (_Popup, addPedalPopup, _OptionMenu, $, resources) {
		var methods = {};
		
		/*Make sure the window nextNewPedalBoardIdoardId value is setup*/
		if (window && !window.nextNewPedalBoardId)
			 window.nextNewPedalBoardId = 1;
		
		/*Params:
		 *  @title: The inital title for the pedal board
		 *  @addPedalCallback: (the visual/dom pedal board is automatically updated)
		 *			 Params: @pedal: the new pedal object
		 *  @deletePedalCallback: (the visual/dom pedal board is automatically updated)
		 *			 Params: @pedal: the deleted pedal object
		 */
		methods.create =  function (title, appendTo, addPedalCallback, deletePedalCallback, deleteBoardCallback) {
			 var content = $("<div>", { "class": "pedal-board" });
		
			 var menuButton = $('<svg class="float-right menu-icon" version="1.1" x="0px" y="0px" viewBox="0 0 70.627 62.27" enable-background="new 0 0 70.627 62.27" xml:space="preserve">' + 
			 		  "<g>" +
	 		 		 			 "<rect width='70.627' height='12.669'/>" +
								 "<rect y='24.8' width='70.627' height='12.67'/>" + 
	               "<rect y='49.601' width='70.627' height='12.669'/>" + 
			  	  "</g>" +
			 "</svg>");
					 
	 		 var popup = _Popup.create(content, {
					  renameable: true,
					  resizable: true,
						moveable: true,
						//TODO: movecontain: methods.toAppendTo,
						id: "pedal-board-" + window.nextNewPedalBoardId++,
						title: title,
						header: menuButton,
						init: init
			 });
			 
			 /*Make the pedals sortable*/
			 content.sortable();
			 
			 function addPedalToBoard(pedal) {
					 $("<div>", { "class": "single-pedal-data" })
					 			.appendTo(content)
					 			.text("$" + pedal.price + " - " + pedal.fullName);
					 
			 		 /*Call back!*/
					 if (addPedalCallback)
			 		 		addPedalCallback(pedal);
							
					unflip();
			 }
			 
			 function unflip(flipIfNeeded) {
			  	if (menuButton[0].classList.contains("flipped"))
			 		    menuButton[0].classList.remove("flipped");
			    
			    else if (flipIfNeeded)
			 		    menuButton[0].classList.add("flipped");
			 };
			 
			 var optionsMenu;
			 
			 menuButton.click(function () {			 
          unflip(true);
					
					if (optionsMenu) {
					    optionsMenu.remove();
							optionsMenu = undefined;
							return;
					}
					
					var deleteLink = $("<div>")
					    .text(resources.deletePedalBoard)
  					  .click(function () {
							    if (!confirm(resources.singleBoardDeleteConfirm))
										 return;
							
						      if(deleteBoardCallback)
  					          deleteBoardCallback();
								  
								  popup.el.remove()
  					  });
						
				  var addPedal = $("<div>")
					    .text(resources.addPedalToBoard)
							.click(function () {
							    addPedalPopup.create(menuButton, popup.options.id, addPedalToBoard, unflip);
							});
					
					optionsMenu = _OptionMenu.create(menuButton, addPedal.add(deleteLink));
					
			    $(document).one("click", function () {
					    if (optionsMenu) {
							    unflip();
                  optionsMenu = undefined;
							}
					});
			 });
			 
			 function init(popup) {
  			 	popup.el.appendTo(appendTo);
			 }
							 
			 /*return the popup*/
			 return popup;
		};
		
		return methods;
});
