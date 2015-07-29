define([ "helperMethods" ], function (helpers) {
	"use strict";
	
	/*
	 * Undo/redo event handler "class"
	 *
	 * PARAMS:
	 *   @reverter:       The stateReverter instance to revert with.
	 *   @logger:         The logger for the manager we'd be reverting.
	 *   @initRedoables: [OPTIONAL] The stack to initialize with as the undone but redoable change stack.
	 */
	return function (reverter, logger) {
		var undoneStack = [];
		var undoInProgress = false;
		
		/* For every manager change, reset the stack of undone changes */
		logger.addCallback(function () {
			if (!undoInProgress)
				undoneStack = [];
		});
	
		/*
		 * Undoes the most recent change
		 */
		this.undo = function () {
			/* Grab the change to undo */
			var change = logger.changes.pop();
			
			/* If there is no change to undo, do nothing */
			if (!change) 
				return;
			
			/* Revert the change */
			undoInProgress = true;
			logger.dontLog(function () {
				reverter.revert(change);
			});
			undoInProgress = false;
			
			/* Record the change as undo in case of the case of redo */
			undoneStack.push(change);
		};
		
		/*
		 * Redoes the most recent undo
		 */
		this.redo = function () {
			/* If there's nothing to do, do nothing */
			if (!undoneStack.length)
				return;
			
			/* Replay the change */
			undoInProgress = true;
			reverter.replay(undoneStack.pop());
			undoInProgress = false;
		};
		
		/* Returns a boolean. True if there are any undoneStack changes (that can be redone) */
		this.canRedo = function () {
			return !!undoneStack.length; /* !!casts to boolean */
		};
		
		/* Returns a boolean. True if there are any changes (that can be undone) */
		this.canUndo = function () {
			return !!logger.changes.length; /* !!casts to boolean */
		};
		
		/* Returns the current stack of undone but redoable changes */
		this.getUndoneStack = function () {
			return undoneStack;
		};
	};
});