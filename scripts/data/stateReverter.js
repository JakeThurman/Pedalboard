define([ "helperMethods", "changeTypes" ], function (helpers, changeTypes) {
	"use strict";
	
	var methods = {};

	/*
	 * Gets the stack of changes since and including the change with @changeId
	 *
	 * @changeId:       The id to call @getNextChange until the change returned's id is the same.
	 * @getNextChange:  The function returning the next change in a stack
	 *                      EXAMPLE:
	 *                          function getNextChange() {
	 *                              return logger.changes.pop();
	 *                          }
	 * @putChangeBack: The last change is going to need to be put back into its stack becasue we don't want to revert that change, just to it.
	 *
	 * @returns the stack of changes sorted from newest to oldest.
	 */
	methods.takeUntilId = function(changeId, getNextChange, putChangeBack) {
		var results = helpers.callUntil(getNextChange, function (change) {
			return change.id === changeId;
		});
		
		/* Put the last change back, and don't revert it */
		putChangeBack(results.pop());
		/* Put the rest of the changes back, but keep them so we will revert them */
		helpers.forEach(results, putChangeBack);
		
		return results;
	};
	
	/*
	 * Reverts all of the given change logger changes
	 *
	 * @changeStack: All changes to revert
	 * @manager:     The pedalBoardManager instance to revert on
	 */
	methods.revert = function (changeStack, manager) {
		helpers.forEach(changeStack, function (change) {
			if (change.isBatch) {
				methods.revert(helpers.reverse(change.changes), manager);
				return; /* That's all we want to do with a batch */
			}
			
			var boardId = change.objId;
			
			switch (change.changeType) {
				case changeTypes.addBoard: /* Board was added, so remove it */
					manager.Delete(boardId);
					break;
					
				case changeTypes.renamedBoard: /* Board was renamed, so change it back */
					manager.Rename(boardId, change.oldValue);
					break;
					
				case changeTypes.deleteBoard: /* Board was deleted, so add it back */
					manager.Import(change.oldValue);
					break;
					
				case changeTypes.moveBoard: /* Board was moved so move it back */
					manager.Move(boardId, change.oldValue);
					break;
				
				case changeTypes.resizeBoard: /* Board was resized, so reset to it's old size */
					manager.Resize(boardId, change.oldValue);
					break;
					
				case changeTypes.addPedal: /* Pedal was added, so remove it */
					manager.RemovePedal(change.newValue.id, boardId);
					break;
					
				case changeTypes.removedPedal: /* Pedal removed so add it back */
					manager.AddPedal(change.oldValue, boardId);
					break;
					
				case changeTypes.movePedalToTop:
				case changeTypes.movePedalUp:
				case changeTypes.movePedalToBottom:
				case changeTypes.movePedalDown:
					manager.ReorderPedal(change.oldValue, change.newValue, boardId); /* New is passed in as old, and old as new to change them back */
					break;
					
				case changeTypes.clearedBoard: /* Board cleared */
					throw "Cleared pedals is going to be changed to a batch";
					break;
					
				default:
					throw new TypeError("@changeType is invalid, was: " + changeType);
			}
		});
	};
	
	return methods;
});