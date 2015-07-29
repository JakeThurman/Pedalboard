define([ "helperMethods", "async" ], function (helpers, async) {
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
	
		function doChange(func) {
			undoInProgress = true;
			
			func();
			
			/* Add to the end of the async queue a handler to disable the undoInProgress flag. */
			async.run(function () {
				undoInProgress = false;
			});
		}
	
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
			doChange(function () {
				logger.dontLog(function () {
					reverter.revert(change);
				});
			});
			
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
			doChange(function () {
				reverter.replay(undoneStack.pop());
			});
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