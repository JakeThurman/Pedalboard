define(["helperMethods", "textResources"], function (helpers, resources) {
    "use strict";
	
	var methods = {};
	
	var pedalStorageName = "pedalboardData";
		
	function supports_html5_storage() {
        try { 
			return 'localStorage' in window && window['localStorage'] !== null; 
		}
		catch (e) { 
			return false; 
		}
    }
	
	/* Clears the current save state from this browser. */
	methods.Clear = function() {
	    delete localStorage[pedalStorageName];
	};
		
	/*
	 * Saves the current state for this browser.
	 *
	 * @manager: an instance of pedalboardmanager.js to save the data from.
	 */
	methods.Save = function(manager) {
	    if (supports_html5_storage())
	        localStorage[pedalStorageName] = JSON.stringify(manager.GetBoards());
	};
		
	/* Helper for methods.Restore */
	function getBoardStorage() {
	    /* If the browser supports storing data and there is data stored*/
	    if (supports_html5_storage() && localStorage[pedalStorageName]) { 
		    return JSON.parse(localStorage[pedalStorageName]); /* return the stored data */
		}
		else { /* Get the default board */
		    return [{
				data: {
					Name: resources.defaultPedalBoardName,
					pedals: [],
				},
				clientRect: {
					left: "10px",
					top: "49px",
					width: "509px"
				},
			}];
		}
	}
		
	/*
	 * Restores the last browser save state, or the default state.
	 *
	 * @manager:          an instance of pedalboardmanager.js to restore to.
	 * @contentContainer: $object of the container for the pedal boards.
	 */
	methods.Restore = function(manager, contentContainer) {				
		/*loop through each of the boards*/
		manager.logger.batch(resources.restoreBatchName, function () {
			helpers.forEach(getBoardStorage(), function (board) {
				/* Add the board */
				var domBoard = manager.Add(board.data.Name, contentContainer);
				
				/* TODO: don't hard code this lookup for the content region */
				var pedalContainer = domBoard.el.find(".pedal-board");
				
				/* Place and size the popup as it priviously was */
				domBoard.el.css(board.clientRect);
				
				/* Add each of the pedals to the board */
				helpers.forEach(board.data.pedals, function (pedal) {
					manager.AddPedal(pedal, domBoard.id, pedalContainer);
				});
			});
		});
	};
		
	return methods;
});