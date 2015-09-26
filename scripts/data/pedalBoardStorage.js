define(["helperMethods", "textResources"], function (helpers, resources) {
    "use strict";
	
	var methods = {};
	
	methods.SOTORAGE_NAME_PREFIX = "";
	
	var HISTORY_STORAGE_NAME      = "pedalboardChangeHistory",
	    UNDONE_STACK_STORAGE_NAME = "pedalboardUndoneChangeStack",
		DATA_VERSION_STORAGE_NAME = "pedalboardDataVersion";
	
	function supportsHtml5Storage() {
        try { 
			return 'localStorage' in window && !helpers.isUndefined(window.localStorage); 
		}
		catch (e) { 
			return false; 
		}
    }
	
	function setStoredData(propName, value) {
		
		if (supportsHtml5Storage())
			localStorage[methods.SOTORAGE_NAME_PREFIX + propName] = JSON.stringify(value);
		
	}
	
	function getStoredData(propName) {
		
		propName = methods.SOTORAGE_NAME_PREFIX + propName;
		
		if (supportsHtml5Storage() && localStorage[propName] && localStorage[propName] !== "undefined")
			return JSON.parse(localStorage[propName]);
		
	}
	
	function deleteStoredData(propName) {
		
		if (supportsHtml5Storage())
			delete localStorage[methods.SOTORAGE_NAME_PREFIX + propName];
		
	}
	
	/* 
	 * Clears the currently saved history from the browser
	 */
	methods.Clear = function() {
	    deleteStoredData(HISTORY_STORAGE_NAME)
		deleteStoredData(UNDONE_STACK_STORAGE_NAME);
	};
	
	/*
	 * Saves the current state for this browser.
	 *
	 * @history:     [Array<Changes/Batches>] All of the changes made
	 * @undoneStack: [Array<Changes/Batches>] All of the changes undone recently enough they can be redone still
	 *
	 * OR (overload)
	 *
	 * @data:        [Object] with properites @history & @undoneStack as described above
	 *
	 */	 
	methods.Save = function(history, undoneStack) {
		/* "Overload" conversion */
		if (helpers.isObject(history) && helpers.isArray(history.history)) {
			undoneStack = history.undoneStack;
			history = history.history;			
		}
		if (!helpers.isArray(history))
			throw new TypeError("@history param to pedalBoardStorage.Save() must be an array of batches/changes.");
	
		setStoredData(HISTORY_STORAGE_NAME, history);
		setStoredData(UNDONE_STACK_STORAGE_NAME, undoneStack);
	};
	
	/*
	 * Returns the saved history from previous edit periods as saved in local storage.
	 *     {
	 *         history: [ ... ],
	 *         undo:    [ ... ],
	 *     }
	 */
	methods.Load = function () {
		return {
			history:  getStoredData(HISTORY_STORAGE_NAME),
			undo:     getStoredData(UNDONE_STACK_STORAGE_NAME),
		};
	};
	
	methods.getDataVersion = function () {
		return getStoredData(DATA_VERSION_STORAGE_NAME);
	};
	
	methods.setDataVersion = function (value) {
		setStoredData(DATA_VERSION_STORAGE_NAME, value);
	};
		
	return methods;
});