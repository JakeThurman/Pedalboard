define([ "helperMethods", "_Popup", "tutorial", "changeTypes", "objectTypes" ], function (helpers, _Popup, tutorial, changeTypes, objectTypes) {
	"use strict";
	
	/*
	 * A "class" for the state reveter. Handles replaying and reverting changes as needed.
	 *
	 * @manager:      The pedalBoardManager instance to replay onto
	 * @logger:       The changeLogger instance used with @manager
	 * @popupManager: PopupManager instance for managing popups
	 * @tutorialInfo: Object with properties: .parent  -> DOM node to attach tutorial popups to
	 *                                        .content -> The pre-generated jquery object for the content of the tutorial
	 * @openHistory:  Function that should open the history popup
	 */
	return function (manager, logger, tutorialInfo, openHistory) {
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
					logger.batch(change.batchType, change.objType, change.objId, change.objName, function () {
						methods.replay(change.changes, manager, logger, true);
					});
					return; /* That's all we want to do with a batch */
				}
				
				var boardId = replayOldToNewIdCache[change.objId] || change.objId;
				
				switch (change.objType) {
					case objectTypes.pedalboard:
						switch (change.changeType) {
							case changeTypes.add:
								/* Import and save the created id as the new id, add that to the cache */
								replayOldToNewIdCache[boardId] = manager.Add(change.objName).id;
								break;
								
							case changeTypes.rename:
								manager.Rename(change.newValue, boardId);
								break;
								
							case changeTypes.remove:
								manager.Delete(boardId);
								break;
								
							case changeTypes.move:
								manager.Move(boardId, change.newValue);
								break;
							
							case changeTypes.resize:
								manager.Resize(boardId, change.newValue);
								break;
							
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					case objectTypes.pedal:
						switch (change.changeType) {								
							case changeTypes.add:
								manager.AddPedal(change.newValue, boardId);
								break;
								
							case changeTypes.remove:
								manager.RemovePedal(change.oldValue.index, boardId);
								break;
								
							case changeTypes.move:
								manager.ReorderPedal(change.newValue, change.oldValue, boardId);
								break;
								
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					case objectTypes.history:
						switch (change.changeType) {
							case changeTypes.add:
							case changeTypes.remove:
								openHistory();
								break;
								
							case changeTypes.move:
								console.warn("Restortig move of the history popup not implemented");
								break;
								
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					case objectTypes.tutorial:
						switch (change.changeType) {
							case changeTypes.add:
								tutorial.create(logger, tutorialInfo);
								break;
							
							case changeTypes.remove:
								if (_Popup.isOpen(tutorial.id))
									_Popup.close(tutorial.id);
								break;
								
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					default:
						throw new TypeError("@change.objType is invalid, was: " + change.objType);
				}
			});
		};	
		
		var revertOldToNewIdCache = {}; /* Used for revert. */
		/*
		 * Reverts all of the given change logger changes
		 *
		 * @changeStack:     All changes to revert
		 */
		methods.revert = function (changeStack) {
			helpers.forEach(changeStack, function (change) {
				if (change.isBatch) {
					methods.revert(helpers.reverse(change.changes), manager);
					return; /* That's all we want to do with a batch */
				}
				
				var boardId = revertOldToNewIdCache[change.objId] || change.objId;
				
				switch (change.objType) {
					case objectTypes.pedalboard:
						switch (change.changeType) {
							case changeTypes.add: /* Board was added, so remove it */
								manager.Delete(boardId);
								break;
								
							case changeTypes.rename: /* Board was renamed, so change it back */
								manager.Rename(change.oldValue, boardId);
								break;
								
							case changeTypes.remove: /* Board was deleted, so add it back */
								/* Import and save the created id as the new id, add that to the cache */
								revertOldToNewIdCache[boardId] = manager.Import(change.oldValue)[0];
								break;
								
							case changeTypes.move: /* Board was moved so move it back */
								manager.Move(boardId, change.oldValue);
								break;
							
							case changeTypes.resize: /* Board was resized, so reset to it's old size */
								manager.Resize(boardId, change.oldValue);
								break;
							
							default:
								throw new TypeError("@changeType is invalid, was: " + change.changeType);
						}
						break;
						
					case objectTypes.pedal:
						switch (change.changeType) {
							case changeTypes.add: /* Pedal was added, so remove it */
								/* The pedal was just added so it will be at the end, so get the last index and delete that one */
								var lastPedalIndex = manager.GetBoard(boardId).data.pedals.length - 1;
								manager.RemovePedal(lastPedalIndex, boardId);
								break;
								
							case changeTypes.remove: /* Pedal removed so add it back */
								manager.AddPedal(change.oldValue, boardId);
								/* Now, put it back to the right position */
								/* The pedal was just added so it will be at the end, so get the last index and move that one to the right place */
								var lastPedalIndex = manager.GetBoard(boardId).data.pedals.length - 1;
								manager.ReorderPedal(lastPedalIndex, change.oldValue.index, boardId); 
								break;
								
							case changeTypes.move:
								manager.ReorderPedal(change.oldValue, change.newValue, boardId); /* New is passed in as old, and old as new to change them back */
								break;
								
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
					
					
					case objectTypes.history:
						switch (change.changeType) {
							case changeTypes.add:
							case changeTypes.remove:
								openHistory();
								break;
								
							case changeTypes.move:
								console.warn("Reverting move of the history popup not implemented");
								break;
							
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					case objectTypes.tutorial:
						switch (change.changeType) {
							case changeTypes.add:
								if (_Popup.isOpen(tutorial.id))
									_Popup.close(tutorial.id);
								break;
								
							case changeTypes.remove:
								tutorial.create(logger, tutorialInfo);
								break;
								
							default:
								throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
						}
						break;
						
					default:
						throw new TypeError("@change.objType is invalid, was: " + change.objType);
				}
			});
		};
	};
});