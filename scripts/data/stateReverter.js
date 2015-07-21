define([ "helperMethods", "changeTypes" ], function (helpers, changeTypes) {
	"use strict";
	
	var methods = {};

	/*
	 * Gets the stack of changes since and including the change with @changeId
	 *
	 * @changeId:      The id to call @getNextChange until the change returned's id is the same.
	 * @getNextChange: The function returning the next change in a stack
	 *                     EXAMPLE:
	 *                         function getNextChange() {
	 *                             return logger.changes.pop();
	 *                         }
	 *
	 * @returns the stack of changes sorted from newest to oldest.
	 */
	methods.takeUntilId = function(changeId, getNextChange) {
		return helpers.callUntil(getNextChange, function (change) {
			return change.id === changeId;
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
				methods.revert(helpers.reverse(change.changes));
				return; /* That's all we want to do with a batch */
			}
			
			var boardId = change.objId;
			
			switch (change.changeType) {
				case changeTypes.addBoard: /* Board was added, so remove it */
					manager.Delete(boardId);
					break;
					
				case changeTypes.renamedBoard: /* Board was renamed, so change it back */
					manager.Rename(boardId, change.otherName);
					break;
					
				case changeTypes.deleteBoard: /* Board was deleted, so add it back */
					manager.Add(change.objName);
					break;
					
				case changeTypes.moveBoard: /* Board was moved so move it back */
					manager.Move(boardId, (function () {throw "Prev move data not logged";})());
					break;
					
				case changeTypes.resizeBoard: /* Board was resized, so reset to it's old size */
					manager.Resize(boardId, (function () {throw "Prev resize not logged";})());
					break;
					
				case changeTypes.addPedal: /* Pedal was added, so remove it */
					manager.RemovePedal(boardId, (function () { throw "Pedal id not logged"; })());
					break;
					
				case changeTypes.removedPedal: /* Pedal removed so add it back */
					manager.AddPedal(boardId, (function () { throw "Removed pedal not logged"; }))
					break;
					
				case changeTypes.movePedalToTop:
				case changeTypes.movePedalUp:
				case changeTypes.movePedalToBottom:
				case changeTypes.movePedalDown:
					manager.ReorderPedal((function () { throw "new index not logged" })(), (function () { throw "old index not logged"; })(), boardId);
					break;
					
				case changeTypes.clearedBoard: /* Board cleared */
					helpers.forEach((function () { throw "Cleared pedals not logged" })(), function (pedal) {
						helpers.AddPedal(pedal, boardId, (function () { throw "content container not logged"; })());
					});
					break;
					
				default:
					throw new TypeError("@changeType is invalid, was: " + changeType);
			}
		});
	};
	
	return methods;
});