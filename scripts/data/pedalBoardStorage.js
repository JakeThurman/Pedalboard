define(["helperMethods", "textResources"], function (helpers, resources) {
    "use strict";
	
	var methods = {};
	
	methods.SOTORAGE_NAME_PREFIX = "";
	
	var HISTORY_STORAGE_NAME = "pedalboardChangeHistory";
	var UNDONE_STACK_STORAGE_NAME = "pedalboardUndoneChangeStack";
	
	function supports_html5_storage() {
        try { 
			return 'localStorage' in window && !helpers.isUndefined(window.localStorage); 
		}
		catch (e) { 
			return false; 
		}
    }
	
	/* 
	 * Clears the currently saved history from the browser
	 */
	methods.Clear = function() {
	    delete localStorage[HISTORY_STORAGE_NAME];
	};
	
	/*
	 * Saves the current state for this browser.
	 *
	 * @history:     [Array<Changes/Batches>] All of the changes made
	 * @undoneStack: [Array<Changes/Batches>] All of the changes undone recently enough they can be redone still
	 */	 
	methods.Save = function(history, undoneStack) {
		if (!helpers.isArray(history))
			throw new TypeError("@history param to pedalBoardStorage.Save() must be an array of batches/changes.");
	
	    if (!supports_html5_storage())
			return;
		
		localStorage[methods.SOTORAGE_NAME_PREFIX + HISTORY_STORAGE_NAME]      = JSON.stringify(history);
		localStorage[methods.SOTORAGE_NAME_PREFIX + UNDONE_STACK_STORAGE_NAME] = JSON.stringify(undoneStack);
	};
	
	/*
	 * Returns the saved history from previous edit periods as saved in local storage.
	 *     {
	 *         history: [ ... ],
	 *         undo:    [ ... ],
	 *     }
	 */
	methods.Load = function () {
		if (supports_html5_storage() && localStorage[methods.SOTORAGE_NAME_PREFIX + HISTORY_STORAGE_NAME] && localStorage[methods.SOTORAGE_NAME_PREFIX + UNDONE_STACK_STORAGE_NAME]) {
			return {
				history: JSON.parse(localStorage[methods.SOTORAGE_NAME_PREFIX + HISTORY_STORAGE_NAME]),
				undo:    JSON.parse(localStorage[methods.SOTORAGE_NAME_PREFIX + UNDONE_STACK_STORAGE_NAME]),
			};
		} else {
			return {};
		}
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