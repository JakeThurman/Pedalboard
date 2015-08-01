define([ "_Popup", "textResources", "jquery", "helperMethods", "moment", "changeTypes", "batchTypes", "objectTypes", "stringReplacer", "ChangeLogger", "async" ], 
function ( _Popup, resources, $, helpers, Moment, changeTypes, batchTypes, objectTypes, replacer, ChangeLogger, async ) {
	"use strict";
	
	var methods = {};
	
	/* This can be overriden for the sake of simple unit testing */
	methods.RENDER_ASYNC = true;
	
	/*
	 * Creates a history popup
	 *
	 * PARAMS:
	 *   @logger: The that these changes have to do with
	 *
	 * @returns: The _Popup object for this popup: { id: ..., el: $(...) };
	 */
	methods.create = function(logger) {
		if (!(logger instanceof ChangeLogger))
			throw new TypeError("@logger is required. Please pass in a valid ChangeLogger object to display changes from");
	
		/* set up the user language for the moment library */
		Moment.locale(window.navigator.userLanguage || window.navigator.language);
		
		var content = $("<div>", { "class": "history-popup" });
		
		/* store all of the moment update intervals here so that we can kill them on close */
		var momentUpdateIntervals = [];
		
		function renderChange(change) {
			var changeDiv = $("<div>");
			
			var description = $("<div>", { "class": "description" })
				.appendTo(changeDiv);
			
			if (change.isBatch) {
				/* The text is the provided description */
				description.text(genBatchText(change));
				
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
								changeDiv.append(renderChange(subChange));
							});
							
							renderedSubChanges = true;
						}
					});
				
				changeDiv.prepend(expander)
					.addClass("batch");
			}
			else {
				/* Generate the resource for this change based */
				description.text(genChangeText(change));
			
				changeDiv.addClass("change");
				
				var timeStamp = $("<div>", { "class": "time-stamp" })
					.text(new Moment(change.timeStamp).fromNow())
					.appendTo(changeDiv);
				
				momentUpdateIntervals.push(setInterval(function () { /* every minute, refresh the "from now" */
					if (_Popup.isOpen(thisPopup.id))
						timeStamp.text(new Moment(change.timeStamp).fromNow());
				}, 60000)); /*60,000ms = 1min*/
			}
			
			return changeDiv;
		}
		
		function appendChange(change) {
			/* Don't render changes about this popup! */
			if (change.objType === objectTypes.history)
				return;
		
			function append(content, change) {
				content.append(renderChange(change, true)); 
			}
			
			if (methods.RENDER_ASYNC)
				async.run(append, content, change);
			else 
				append(content, change);
		}
		
		helpers.forEach(logger.changes, appendChange);
		
		function init(popup) {
			var oldRect = popup.el.get(0).getBoundingClientRect();
			
			popup.el.appendTo(document.body)
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
		}
		
		var close = function () {
			async.run(function (momentUpdateIntervals) {
				helpers.forEach(momentUpdateIntervals, function (interval) {
					clearInterval(interval);
				});
			}, momentUpdateIntervals);
			
			logger.log(changeTypes.remove, objectTypes.history, thisPopup.id);
		};
				
		var thisPopup = _Popup.create(content, {
			title: resources.historyPopupTitle,
			id: "history",
			init: init,
			close: close,
		});
		
		/* Display all new top level changes */
		logger.addCallback(function (change) {
			if (_Popup.isOpen(thisPopup.id))
				appendChange(change);
		});
		
		/* Log that this was opened */
		logger.log(changeTypes.add, objectTypes.history, thisPopup.id);
		
		return thisPopup;
	};
	
	function genBatchText(batch) {
		switch (batch.batchType) {
			case batchTypes.firstLoad:
				return resources.batch_firstStartup;
			
			case batchTypes.deleteAll:
				return resources.change_DeleteAllBoards;
			
			case batchTypes.clearBoard:
				return replacer.replace(resources.change_ClearedBoard, batch.objName);
				
			case batchTypes.mixed:
				return replacer.replace(resources.batch_mixedChanges_pedalboard, batch.objName);
				
			default:
				throw new TypeError("@batch.batchType is invalid. Expected to be a batchType \"enum\" value. Was: " + batch.batchType);
		}
	}
	function genChangeText(change) {
		switch (change.objType) {
			case objectTypes.pedalboard:
				switch (change.changeType) {
					case changeTypes.add: 
						return replacer.replace(resources.change_AddBoard, change.objName);
					
					case changeTypes.rename:
						return replacer.replace(resources.change_RenamedBoard, [ change.otherName, change.objName ]);
						
					case changeTypes.remove:
						return replacer.replace(resources.change_DeleteBoard, change.objName);
						
					case changeTypes.move:
						return replacer.replace(resources.change_MoveBoard, change.objName);
						
					case changeTypes.resize:
						return replacer.replace(resources.change_ResizeBoard, change.objName);
					
					default:
						throw new TypeError("@change.changeType is invalid, was: " + change.changeType);
				}
				break;
			
			case objectTypes.pedal:
				switch (change.changeType) {
					case changeTypes.add: 
						return replacer.replace(resources.change_AddPedal, [ change.otherName, change.objName ]);
						
					case changeTypes.remove:
						return replacer.replace(resources.change_RemovedPedal, [ change.otherName, change.objName ]);
						
					case changeTypes.move:
						var resource = change.newValue === 0
							? resources.change_MovePedalToTop /* To Top */
							: change.oldValue > change.newValue
								? resources.change_MovePedalUp /* Up */
								: resources.change_MovePedalDown; /* Down */
						return replacer.replace(resource, [ change.otherName, change.objName ]);
					
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