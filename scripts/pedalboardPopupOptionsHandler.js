define(["_OptionMenu", "jquery", "addPedalPopup", "textResources"], function (_OptionMenu, $, addPedalPopup, resources) {
    var methods = {};
			
		/*
		 *  @id:                the id of this popup
		 *  @menubutton:        $object of the menu button
		 *  @removePopupAction: calling this should remove the popup from the dom (Params: id)
		 *  @helpActions:       object with bool returning help functions
		 *      Params:
		 *          @anyPedals: 
		 *              Params: @boardId: the id of this board.
		 *
		 *  @callbacks:         object with callback functions
		 *      Params:
		 *          @addPedal:
		 *              Params: @pedal: the classes.pedal object of the pedal added
		 *          @deleteBoard: 
		 *              Params: @boardId: the id of this pedalboard
		 *      
		 */
 		methods.handle = function (id, menuButton, removePopupAction, helpActions, callbacks) {
		    if (!callbacks) callbacks = {};
		
		    var optionsMenu;
		
		    /* sometimes flips, not just unflip. this is also semi-broken. and this needs to be named better... */
			  function unflip(flipIfNeeded) {
			      if (menuButton[0].classList.contains("flipped"))
			 		      menuButton[0].classList.remove("flipped");
			    
			      else if (flipIfNeeded)
			 		      menuButton[0].classList.add("flipped");
			  };
		
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
      			
                if(callbacks.deleteBoard)
      			        callbacks.deleteBoard(id);
      				  
                removePopupAction(id);
      		  });
      		
        var addPedal = $("<div>")
      	    .text(resources.addPedalToBoard)
      			.click(function () {
      			    addPedalPopup.create(menuButton, id, function (pedal) {
										if (callbacks.addPedal) callbacks.addPedal(pedal); 
								    unflip(); 
							 }, unflip);
      			});
      			
      	var clearLink = $("<div>")
      			.text(resources.clearPedalsFromBoard)
      			.click(function () {
      			    if (!confirm(resources.clearPedalsFromBoardConfirm))
      					    return;
      							
      					helpers.forEach(allPedals, function (pedal) {
      			        pedal.remove();
      	        });
      					
                if (callbacks.clear)
      			        callbacks.clear(id);
      	    });
      			
      	/* We can't clear a board with no pedals... */
      	var options = helpActions.anyPedals(id) 
      	    ? addPedal.add(clearLink).add(deleteLink)
      			: addPedal.add(deleteLink);
      	
      	optionsMenu = _OptionMenu.create(options, menuButton);
      	
        $(document).one("click", function () {
      	    if (optionsMenu) {
      			    unflip();
                optionsMenu = undefined;
      			}
        });
    }
		
		return methods;
});