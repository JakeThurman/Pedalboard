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
	 * Replays all of the given change logger changes
	 *
	 * @changeStack: All changes to revert
	 * @manager:     The pedalBoardManager instance to replay onto
	 */
	methods.replay = function (changeStack, manager) {
		helpers.forEach(changeStack, function (change) {
			if (change.isBatch) {
				methods.replay(change.changes, manager);
				return; /* That's all we want to do with a batch */
			}
			
			var boardId = change.objId;
			
			switch (change.changeType) {
				case changeTypes.addBoard:
					manager.Import(change.newValue);
					break;
					
				case changeTypes.renamedBoard:
					manager.Rename(change.newValue, boardId);
					break;
					
				case changeTypes.deleteBoard:
					manager.Delete(boardId);
					break;
					
				case changeTypes.moveBoard:
					manager.Move(boardId, change.newValue);
					break;
				
				case changeTypes.resizeBoard:
					manager.Resize(boardId, change.newValue);
					break;
					
				case changeTypes.addPedal:
					manager.AddPedal(change.newValue, boardId);
					break;
					
				case changeTypes.removedPedal:
					manager.RemovePedal(change.oldValue.index, boardId);
					break;
					
				case changeTypes.movePedal:
					manager.ReorderPedal(change.newValue, change.oldValue, boardId);
					break;
					
				default:
					throw new TypeError("@changeType is invalid, was: " + changeType);
			}
		});
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
					manager.Rename(change.oldValue, boardId);
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
					/* The pedal was just added so it will be at the end, so get the last index and delete that one */
					var lastPedalIndex = manager.GetBoard(boardId).data.pedals.length - 1;
					manager.RemovePedal(lastPedalIndex, boardId);
					break;
					
				case changeTypes.removedPedal: /* Pedal removed so add it back */
					manager.AddPedal(change.oldValue, boardId);
					break;
					
				case changeTypes.movePedal:
					manager.ReorderPedal(change.oldValue, change.newValue, boardId); /* New is passed in as old, and old as new to change them back */
					break;
					
				default:
					throw new TypeError("@changeType is invalid, was: " + changeType);
			}
		});
	};
	
	return methods;
});