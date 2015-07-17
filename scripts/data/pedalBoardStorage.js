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
		
	/*
	 * Returns the last browser save state, or the default state.
	 */
	methods.Load = function() {
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
	};
		
	return methods;
});