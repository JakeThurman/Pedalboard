define(["_OptionMenu", "jquery", "addPedalPopup", "textResources"], function (_OptionMenu, $, addPedalPopup, resources) {
    var methods = {};
		var optionsMenu;

		/*
		 *  @id:                the id of this popup,
		 *  @menubutton:        $object of the menu button,
		 *  @pedalContainer:    the container to append new pedals,
		 *  @manager:           the pedalBoardManager.js instance to add the pedal to.
		 */
 		methods.handle = function (id, menuButton, pedalContainer, manager) {
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
      					
     			      manager.Delete(id);
      		  });
      		
        var addPedal = $("<div>")
      	    .text(resources.addPedalToBoard)
      			.click(function () {
      			    addPedalPopup.create(menuButton, id, function (pedal) {
										manager.AddPedal(pedal, id, pedalContainer);
                    unflip(); 
						    }, unflip);
      			});
      			
      	var clearLink = $("<div>")
      			.text(resources.clearPedalsFromBoard)
      			.click(function () {
      			    if (confirm(resources.clearPedalsFromBoardConfirm))
      					    manager.Clear(id);
      	    });
						
				var reportButton = $("<div>")
				    .text(resources.boardReportButton);
						
				var compareButton = $("<div>")
				    .text(resources.boardCompareButton);
      			
      	/* We can't clear a board with no pedals... */
      	var options = manager.AnyPedals(id) 
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