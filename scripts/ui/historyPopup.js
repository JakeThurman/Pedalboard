define([ "_Popup", "textResources", "jquery", "helperMethods", "moment", "changeTypes", "batchTypes", "objectTypes", "stringReplacer", "ChangeLogger", "async" ], 
function ( _Popup, resources, $, helpers, Moment, changeTypes, batchTypes, objectTypes, replacer, ChangeLogger, async ) {
	"use strict";
	
	/* Map of change/batch id to rendered change */
	var renderCache = {};
		
	var methods = {};
	
	/* This can be overriden for the sake of simple unit testing */
	methods.RENDER_ASYNC = true;
	
	methods.id = "history";
	
	/*
	 * Creates a history popup
	 *
	 * PARAMS:
	 *   @logger:     The that these changes have to do with
	 *   @parentNode: The node of the dom to append to the popup to
	 *
	 * @returns: The _Popup object for this popup: { id: ..., el: $(...) };
	 */
	methods.create = function(logger, parentNode) {
		
		if (!(logger instanceof ChangeLogger))
			throw new TypeError("@logger is required. Please pass in a valid ChangeLogger object to display changes from");
	
		/* set up the user language for the moment library */
		Moment.locale(window.navigator.userLanguage || window.navigator.language);
		
		var content = $("<div>", { "class": "history-popup" });
		
		/* store all of the moment update intervals here so that we can kill them on close */
		var momentUpdateIntervals = [];
		
		/* Stores the last rendered change */
		var lastRendered;
		var lastRender;
		var lastRenderedBatch;
		var lastBatchRender;
		
		function renderChange(change, isSmartBatchChange) {
			/* If we already rendered it, use that. */
			if (!change.isBatch && renderCache[change.id])
				return renderCache[change.id];
			
			var changeDiv = $("<div>");
			
			var description = $("<div>", { "class": "description" })
				.appendTo(changeDiv);
			
			if (change.isBatch) {
				/* The text is the provided description */
				description.text(genBatchText(change, isSmartBatchChange));
				
				/* So we can lazily render batch changes we need, but not multiple times */
				var renderedSubChanges = false;
				
				var expander = $("<i>", { "class": "float-left fa fa-plus-square" });
				
				expander.add(description)
					.click(function () {
						changeDiv.toggleClass("expanded");
						expander.toggleClass("fa-plus-square")
							.toggleClass("fa-minus-square");
							
						/* Lazily render sub changes */
						if (!renderedSubChanges) {
							helpers.forEach(change.changes, function (subChange) {
								changeDiv.append(renderChange(subChange, /*isSmartBatchChange: */ isSmartBatchChange || change.batchType === batchTypes.smartBatch));
							});
							
							renderedSubChanges = true;
						}
					});
				
				changeDiv.prepend(expander)
					.addClass("batch");
				
				lastRenderedBatch = change;
				lastBatchRender = changeDiv;
			}
			else {
				/* Generate the resource for this change based */
				description.text(genChangeText(change, isSmartBatchChange));
			
				changeDiv.addClass("change");
				
				var timeStamp = $("<div>", { "class": "time-stamp" })
					.text(new Moment(change.timeStamp).fromNow())
					.appendTo(changeDiv);
				
				momentUpdateIntervals.push(setInterval(function () { /* every minute, refresh the "from now" */
					if (_Popup.isOpen(thisPopup.id))
						timeStamp.text(new Moment(change.timeStamp).fromNow());
				}, 60000)); /*60,000ms = 1min*/
			}
			
			/* Save what we just did for the sake of smart batching */
			lastRendered = change;
			lastRender = changeDiv;
			
			/* Cache it! */
			if (!change.isBatch)
				renderCache[change.id] = changeDiv;
					
			return changeDiv;
		}
		
		function render(change) {
			content.append(renderChange(change));
		}
		
		function appendChange(change) {
			/* 
			 * Don't render changes about this popup!
			 * Also don't render changes about the tutorial popup.
			 */
			if (change.objType === objectTypes.history || change.objType === objectTypes.tutorial)
				return;
			
			/* The first change rendered will have not set this yet, so just render this change */
			if (!lastRendered)
				return render(change);
			
			var lastIsBatch = content.children().last().hasClass("batch");
			var isForSameObj = lastRendered.objId === change.objId 
				&& lastRendered.objName === change.objName;
			
			/* If the last change was a smart batch for the same object */
			if (lastIsBatch && lastRenderedBatch.batchType == batchTypes.smartBatch && isForSameObj) {
				
				lastBatchRender.append(renderChange(change));
			
			/* If the last change rendered was for the same object */
			} else if (isForSameObj && !lastIsBatch) {
				
				lastRender.detach();
				render({
					isBatch: true,
					batchType: batchTypes.smartBatch,
					objId: change.objId,
					objName: change.objName,
					changes: [lastRendered, change],
				});
			
			/* Otherwise, just render the change normally */
			} else {
				render(change);
			}
		}
		
		function renderAll(changes) {
			helpers.forEach(changes, appendChange);
		};
		
		var killCallback;
		function init(popup) {
			var oldRect = popup.el.get(0).getBoundingClientRect();
			
			popup.el.appendTo(parentNode)
				.addClass("history-popup-outer")
				.draggable({ 
					handle: ".header",
					stop: function () {
						/* Log the move */
						var newRect = popup.el.get(0).getBoundingClientRect();
						
						logger.log(changeTypes.move, objectTypes.history, popup.id, oldRect, newRect);
						
						oldRect = newRect;
					},
				});
				
			if (methods.RENDER_ASYNC)
				async.run(renderAll, logger.changes);
			else 
				renderAll(logger.changes);
			
			/* Display all new top level changes */
			killCallback = logger.addCallback(function (change) {
				appendChange(change);
			});
			
			/* Log that this was opened */
			logger.log(changeTypes.add, objectTypes.history, popup.id);
		}
		
		var close = function () {
			killCallback();
			
			async.run(function (momentUpdateIntervals) {
				helpers.forEach(momentUpdateIntervals, function (interval) {
					clearInterval(interval);
				});
			}, momentUpdateIntervals);
			
			logger.log(changeTypes.remove, objectTypes.history, thisPopup.id);
		};
				
		var thisPopup = _Popup.create(content, {
			title: resources.historyPopupTitle,
			id: methods.id,
			init: init,
			close: close,
		});
		
		return thisPopup;
	};
	
	function genBatchText(batch, isSmartBatchChange) {
		switch (batch.batchType) {
			case batchTypes.firstLoad:
				return resources.batch_firstStartup;
			
			case batchTypes.deleteAll:
				return resources.batch_DeleteAllBoards;
			
			case batchTypes.clearBoard:
				return isSmartBatchChange
					? resources.batch_NoBoardName_ClearedBoard
					: replacer.replace(resources.batch_ClearedBoard, batch.objName);
				
			case batchTypes.smartBatch:
				return replacer.replace(resources.batch_mixedChanges_pedalboard, batch.objName);
				
			default:
				throw new TypeError("@batch.batchType is invalid. Expected to be a batchType \"enum\" value. Was: " + batch.batchType);
		}
	}
	
	function genChangeText(change, isSmartBatchChange) {		
		switch (change.objType) {
			case objectTypes.pedalboard:
				switch (change.changeType) {
					case changeTypes.add: 
						return isSmartBatchChange 
							? resources.change_NoBoardName_AddBoard 
							: replacer.replace(resources.change_AddBoard, change.objName);
					
					case changeTypes.rename:
						return replacer.replace(resources.change_RenamedBoard, [ change.otherName, change.objName ]);
						
					case changeTypes.remove:
						return isSmartBatchChange
							? resources.change_NoBoardName_DeleteBoard
							: replacer.replace(resources.change_DeleteBoard, change.objName);
						
					case changeTypes.move:
						return isSmartBatchChange
							? resources.change_NoBoardName_MoveBoard
							: replacer.replace(resources.change_MoveBoard, change.objName);
						
					case changeTypes.resize:
						return isSmartBatchChange
							? resources.change_NoBoardName_ResizeBoard
							: replacer.replace(resources.change_ResizeBoard, change.objName);
					
					default:
						throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
				}
				break;
			
			case objectTypes.pedal:
				switch (change.changeType) {
					case changeTypes.add: 
						return isSmartBatchChange
							? replacer.replace(resources.change_NoBoardName_AddPedal, change.otherName)
							: replacer.replace(resources.change_AddPedal, [ change.otherName, change.objName ]);
						
					case changeTypes.remove:
						return isSmartBatchChange
							? replacer.replace(resources.change_NoBoardName_RemovedPedal, change.otherName)
							: replacer.replace(resources.change_RemovedPedal, [ change.otherName, change.objName ]);
						
					case changeTypes.move:
					{
						if (isSmartBatchChange) {
							var resource = change.newValue === 0
								? resources.change_NoBoardName_MovePedalToTop /* To Top */
								: change.oldValue > change.newValue
									? resources.change_NoBoardName_MovePedalUp /* Up */
									: resources.change_NoBoardName_MovePedalDown; /* Down */
							return replacer.replace(resource, change.otherName);
						}
						else {
							var resource = change.newValue === 0
								? resources.change_MovePedalToTop /* To Top */
								: change.oldValue > change.newValue
									? resources.change_MovePedalUp /* Up */
									: resources.change_MovePedalDown; /* Down */
							return replacer.replace(resource, [ change.otherName, change.objName ]);
						}
					}
					default:
						throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
				}
				break;
					
			default:
				throw new TypeError("@change.objType is invalid, was: " + change.objType);
		}
	}
	
	return methods;
});