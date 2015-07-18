define(["helperMethods", "textResources"], function (helpers, resources) {
    "use strict";
	
	var methods = {};
	
	var pedalboardStorageName = "pedalboardData";
	var historyStorageName = "pedalboardChangeHistory";
	
	function supports_html5_storage() {
        try { 
			return 'localStorage' in window && window['localStorage'] !== null; 
		}
		catch (e) { 
			return false; 
		}
    }
	
	/* 
	 * Clears the currently saved history from the browser
	 */
	methods.ClearHistory = function() {
	    delete localStorage[historyStorageName];
	};
		
	/*
	 * Saves the current state for this browser.
	 *
	 * @boards:  [Array<Manager.GetBoard()>] All of the boards added to the current pedalboard manager.
	 * @history: [Array<Changes/Batches>]    All of the changes ever made
	 */
	methods.Save = function(boards, history) {
	    if (!supports_html5_storage())
			return;
		
		localStorage[pedalboardStorageName] = JSON.stringify(boards);
		localStorage[historyStorageName] = JSON.stringify(history);
	};
	
	/*
	 * Returns the saved history from previous edit periods as saved in local storage.
	 */
	methods.GetHistory = function () {
		if (supports_html5_storage() && localStorage[historyStorageName])
			return JSON.parse(localStorage[historyStorageName]);
	};
	
	methods.HasSavedData = function () {
		return supports_html5_storage() && localStorage[historyStorageName];
	};
	
	/*
	 * Returns the last browser save state, or the default state.
	 */
	methods.Load = function() {
	    /* If the browser supports storing data and there is data stored*/
	    if (supports_html5_storage() && localStorage[pedalboardStorageName]) { 
		    return JSON.parse(localStorage[pedalboardStorageName]); /* return the stored data */
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