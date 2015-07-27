define([ "helperMethods", "changeTypes" ], function (helpers, changeTypes) {
	"use strict";
	
	/*
	 * A "class" for the state reveter. Handles replaying and reverting changes as needed.
	 *
	 * @manager:     The pedalBoardManager instance to replay onto
	 * @logger:      The changeLogger instance used with @manager
	 */
	return function (manager, logger) {
		var methods = this;
	
		var replayOldToNewIdCache = {}; /* Used for replay. */
		/*
		 * Replays all of the given change logger changes
		 *
		 * @changeStack: All changes to revert
		 */
		methods.replay = function (changeStack) {
			helpers.forEach(changeStack, function (change) {
				if (change.isBatch) {
					/* Replay it inside of a batch as well */
					logger.batch(change.batchType, change.objId, change.objName, function () {
						methods.replay(change.changes, manager, logger, true);
					});
					return; /* That's all we want to do with a batch */
				}
				
				var boardId = replayOldToNewIdCache[change.objId] || change.objId;
				
				switch (change.changeType) {
					case changeTypes.addBoard:
						/* Import and save the created id as the new id, add that to the cache */
						replayOldToNewIdCache[boardId] = manager.Add(change.objName).Id;
						break;
						
					case changeTypes.renameBoard:
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
						throw new TypeError("@changeType is invalid, was: " + change.changeType);
				}
			});
		};	
		
		/*
		 * Reverts all of the given change logger changes
		 *
		 * @changeStack:     All changes to revert
		 * @oldToNewIdCache: Used for recursive callback only!
		 */
		methods.revert = function (changeStack, oldToNewIdCache) {
			/* Validate the cache */
			if (!helpers.isObject(oldToNewIdCache) && !helpers.isUndefined(oldToNewIdCache))
				throw new TypeError("@oldToNewIdCache (used for recursive calls only) is invalid!");
			
			/* Reset the cache of the saved id to the real id (i.e. when creating a board, the id will be whatever it's generated with not what's logged.) */
			oldToNewIdCache = oldToNewIdCache || {};
			
			helpers.forEach(changeStack, function (change) {
				if (change.isBatch) {
					methods.revert(helpers.reverse(change.changes), manager, oldToNewIdCache);
					return; /* That's all we want to do with a batch */
				}
				
				var boardId = oldToNewIdCache[change.objId] || change.objId;
				switch (change.changeType) {
					case changeTypes.addBoard: /* Board was added, so remove it */
						manager.Delete(boardId);
						break;
						
					case changeTypes.renameBoard: /* Board was renamed, so change it back */
						manager.Rename(change.oldValue, boardId);
						break;
						
					case changeTypes.deleteBoard: /* Board was deleted, so add it back */
						/* Import and save the created id as the new id, add that to the cache */
						oldToNewIdCache[boardId] = manager.Import(change.oldValue)[0];
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
						throw new TypeError("@changeType is invalid, was: " + change.changeType);
				}
			});
		};
	};
});