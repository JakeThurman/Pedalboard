define(["helperMethods", "textResources", "changeTypes"], function (helpers, resources, changeTypes) {
    "use strict";
	
	var methods = {};
	
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
	methods.Clear = function() {
	    delete localStorage[historyStorageName];
	};
	
	/*
	 * Saves the current state for this browser.
	 *
	 * @history: [Array<Changes/Batches>]    All of the changes ever made
	 */	 
	methods.Save = function(history) {
		if (!helpers.isArray(history))
			throw new TypeError("@history param to pedalBoardStorage.Save() must be an array of batches/changes.");
	
	    if (supports_html5_storage())
			localStorage[historyStorageName] = JSON.stringify(history);
	};
	
	/*
	 * Returns the saved history from previous edit periods as saved in local storage.
	 */
	methods.Load = function () {
		if (supports_html5_storage() && localStorage[historyStorageName])
			return JSON.parse(localStorage[historyStorageName]);
	};
	
	methods.HasSavedData = function () {
		return supports_html5_storage() && !!localStorage[historyStorageName];
	};
	
	methods.GetDefaultBoard = function () {
		return {
			data: {
				Name: resources.defaultPedalBoardName,
				pedals: [],
			},
			clientRect: {
				left: "10px",
				top: "49px",
				width: "509px"
			},
		};
	};
		
	return methods;
});