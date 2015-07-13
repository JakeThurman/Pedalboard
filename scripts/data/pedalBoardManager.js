define(["pedalBoardClasses", "pedalboardPopup", "pedalRenderer", "changeLogger", "stringReplacer", "textResources", "helperMethods", "changeTypes", "objectTypes"], function (classes, pedalBoardPopup, pedalRenderer, changeLogger, replacer, resources, helpers, changeTypes, objectTypes) {
	var actions = {};
		
	actions.create = function () {
		var manager = {};
			
		/* create a logger instance */
		manager.logger = changeLogger.create();
		
		/* Where all of the managed boards are stored */
		var boards = {};
		
		/* separate from boards so that we can keep it more light weight for configuration logs */
		var changeCallbacks = {};
		var allBoardChangeCallbacks = [];
		
		/* validation helper */
		function assertBoardIdExists(id) {
			if (!boards[id]) 
				throw new Error("A board with id of: \"" + id + "\" does not exist");
		}
		
		/* partial copy helper */
		function getClientRect(fullRect) {
			return {
				left: fullRect.left,
				top: fullRect.top,
				width: fullRect.width,
			};
		}
			
		/* !Data Methods! */
		/*Get the board with id of @boardId */
		manager.GetBoard = function (boardId) {
			var board = boards[boardId];
			
			/* if no board was found, just return undefined now */
			if (helpers.isUndefined(board))
				return board;
			
			/* Selectively copy the board */
			var thisBoard = {
				data: board.data,
				clientRect: board.clientRect,
				id: board.id,
			};
			
			/* If there is a board, but no clientRect, get the current one */
			if (helpers.isUndefined(thisBoard.clientRect)) {
				thisBoard.clientRect = getClientRect(board.dom.el.get(0).getBoundingClientRect());
			}
			
			return thisBoard;
		};
		
		/* Get an array of all of the board data */
		manager.GetBoards = function () {
			var out = [];
			for(var key in boards) {
				out.push(manager.GetBoard(key));
			}
			return out;
		};
		
		/* Are there any boards [where func]? */
		manager.Any = function (where) {
			for(var key in boards) {
				if (!where || where(manager.GetBoard(key))) /* if there is no where statement, or this one counts */
					return true; /* if any return true of the first one */
			}
			return false;
		};
		
		/* Are there multiple boards [where func]? */
		manager.Multiple = function (where) {
			var any = false;
			for (var key in boards) {
				if (where && !where(manager.GetBoard(key)))
					continue;
			
				if (any) /* This way we have to set that the first time */
					return true; /* And then the second we can return this */
				any = true;
			}
			return false;
		};
		
		/* Are there any pedals on the board with id of @boardId? */
		manager.AnyPedals = function (boardId) {
			var board = boards[boardId];
			return board ? board.data.pedals.length > 0 : false; /* If there is no board with this id return false */
		};
		
		/* Are there multiple pedals on board with id of @boardId? */
		manager.MultiplePedals = function (boardId) {
			var board = boards[boardId];
			return board ? board.data.pedals.length > 1 : false; /* If there is no board with this id return false */
		};
	
		/* ! Board Methods ! */
		/* logging helper to reduce duplicate code */
		function log(resource, params, changeType, boardId, objectType) {
			manager.logger.log(replacer.replace(resource, params), changeType, boardId, objectType);
		}
		
		/* Add a board! */
		manager.Add = function (name, contentConatiner) {	
			var domboard = pedalBoardPopup.create(name, contentConatiner, manager);
		
			boards[domboard.id] = { 
				dom: domboard,
				data: new classes.PedalBoard(name),
				id: domboard.id,
				__pedalEls: [], /* we use this for caching the rendered pedals so that we can easily access them for removing/clearing */
			};
						
			log(resources.change_AddBoard, name, changeTypes.addBoard, domboard.id, objectTypes.pedalboard);
			callChangeCallbacks();
			
			return domboard;
		};
		
		/* Rename a board */
		manager.Rename = function (name, boardId) {
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var oldName = boards[boardId].data.Name;
						
			/* update the saved data object */
			boards[boardId].data.Name = name;

			/* log this change to the history */
			log(resources.change_RenamedBoard, [ oldName, name ], changeTypes.renamedBoard, boardId, objectTypes.pedalboard);
			
			/* call all of the change callbacks for this board id */
			callChangeCallbacks(boardId);
		};
		
		/* Delete a board */
		manager.Delete = function (boardId) {			
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var name = boards[boardId].data.Name;
					
			boards[boardId].dom.el.remove();
			delete boards[boardId];
			delete changeCallbacks[boardId];
							
			log(resources.change_DeleteBoard, name, changeTypes.deleteBoard, boardId, objectTypes.pedalboard);
			callChangeCallbacks();
		};
		
		/* Delete all of the boards */
		manager.DeleteAll = function () {
			manager.logger.batch(resources.change_DeleteAllBoards, function () { /* log deleting each board as a batch */
				for(var key in boards)
					manager.Delete(key);
			});
			
			callChangeCallbacks();
		};
		
		/* Board-UI logging methods */
		/*  clientRect = (vanilla js element).getBoundingClientRect(); */
		function assertClientRectIsValid(clientRect) {
			if (!(clientRect instanceof ClientRect))
				throw new TypeError("clientRect is not a ClientRect. Try using (vanilla js element).getBoundingClientRect()") 
		}
		
		/* log a moved board */
		manager.Move = function (boardId, clientRect) {
			assertBoardIdExists(boardId);
			assertClientRectIsValid(clientRect);
			
			boards[boardId].clientRect = getClientRect(clientRect);
			log(resources.change_MoveBoard, boards[boardId].data.Name, changeTypes.moveBoard, boardId, objectTypes.pedalboard);
			callChangeCallbacks(boardId);
		}
		
		/* log a resized board */
		manager.Resize = function (boardId, clientRect) {
			assertBoardIdExists(boardId);
			assertClientRectIsValid(clientRect);
			
			boards[boardId].clientRect = getClientRect(clientRect);
			log(resources.change_ResizeBoard, boards[boardId].data.Name, changeTypes.resizeBoard, boardId, objectTypes.pedalboard);
			callChangeCallbacks(boardId);
		}
		
		/* ! Pedal Methods ! */
		/* 
		 * Add the passed in pedal object to the board with id of @boardId. 
		 * Optionally then appends the created dom element to @pedalContainer 
		 */
		manager.AddPedal = function (pedal, boardId, pedalContainer) {
			assertBoardIdExists(boardId);
			
			/* render the pedal and cache it so we can use it for removing/clearing */
			var rendered = pedalRenderer.render(pedal);
			boards[boardId].__pedalEls.push(rendered);
			
			/* add the data pedal */
			boards[boardId].data.Add(pedal);
			
			/* log this change to the history */
			log(resources.change_AddPedal, [ pedal.fullName, boards[boardId].data.Name ], changeTypes.addPedal, boardId, objectTypes.pedal);
				
			/* call all of the change callbacks for this board id */
			callChangeCallbacks(boardId);
			
			/* if the gave us something append the rendered pedal to, do it. */
			if (pedalContainer) rendered.appendTo(pedalContainer);
			
			return rendered;
		};
		
		/* Remove a pedal with id of @pedal id from the board with id of @boardId. */
		/* NOTE: this function breaks convention and DOES NOT handle the dom. This
		   is becuase choosing which instance of a pedal that is on the same board
		   is not yet implimented. */
		manager.RemovePedal = function (pedalId, boardId) {	
			assertBoardIdExists(boardId);			
			var removedPedal = boards[boardId].data.Remove(pedalId);
			
			/* log this change to the history */
			log(resources.change_RemovedPedal, [ removedPedal.fullName, boards[boardId].data.Name ], changeTypes.removedPedal, boardId, objectTypes.pedal);
			
			/* call all of the change callbacks for this board id */
			callChangeCallbacks(boardId);
		};
		
		/* Moves a pedal at index of @oldPedalIndex to @newPedalIndex on board with id of @boardId */
		manager.ReorderPedal = function (oldPedalIndex, newPedalIndex, boardId) {	
			assertBoardIdExists(boardId);
			
			if (oldPedalIndex < 0 || newPedalIndex < 0)
				throw new Error("Indexes cannot be negative! Old: " + oldPedalIndex + " New: " + newPedalIndex);
			
			var reorderedPedal = boards[boardId].data.Reorder(oldPedalIndex, newPedalIndex);
			
			/* log this change to the history */
			var reorderLogResource;
			var changeType;
			
			if (newPedalIndex === 0 ) { /* To Top */
				reorderLogResource = resources.change_MovePedalToTop;
				changeType = changeTypes.movePedalToTop;
			}
			else if (oldPedalIndex > newPedalIndex) { /* Up */
				reorderLogResource = resources.change_MovePedalUp;
				changeType = changeTypes.movePedalUp;
			}
			else if (newPedalIndex === (boards[boardId].data.pedals.length - 1)) { /* To Bottom */
				reorderLogResource = resources.change_MovePedalToBottom;
				changeType = changeTypes.movePedalToBottom;
			}
			else { /* Down */
				reorderLogResource = resources.change_MovePedalDown;
				changeType = changeTypes.movePedalDown;
			}
			
			log(reorderLogResource, [ reorderedPedal.fullName, boards[boardId].data.Name ], changeType, boardId, objectTypes.pedal);
			
			/* call all of the change callbacks for this board id */
			callChangeCallbacks(boardId);
		};
			
		/* Clear the board with id of @boardId of all pedals*/
		manager.Clear = function (boardId) {
			assertBoardIdExists(boardId);			
			
			/*remove the pedals from the dom */
			helpers.forEach(boards[boardId].__pedalEls, function (pedalEl) { 
			    pedalEl.remove();
			});	
			/* reset the dom container */
			boards[boardId].__pedalEls = []; 
			
			/* clear the data pedals from the data board */
			boards[boardId].data.Clear();
			
			/* log this change to the history */
			log(resources.change_ClearedBoard, boards[boardId].data.Name, changeTypes.clearedBoard, boardId, objectTypes.pedalboard);
			
			/* call all of the change callbacks for this board id */
			callChangeCallbacks(boardId);
		};
		
		
		/* ! Change Callbacks ! */
		/* calls all of the change callback functions for the given board id, and all global callbacks */
		function callChangeCallbacks(boardId) {	
			var change = manager.logger.changes[manager.logger.changes.length - 1];
			
			if (!helpers.isUndefined(boardId)) {
				helpers.forEach(changeCallbacks[boardId], function (callback) {
					callback(change);
				});
			}
			helpers.forEach(allBoardChangeCallbacks, function (callback) {
				callback(change);
			});
		}
		
		/* Add a change callback to a board */
		manager.AddChangeCallback = function (boardId, func) {
			if (typeof func !== "function") {
				if (typeof boardId === "function" && helpers.isUndefined(func)) {
					func = boardId; /* this is a global/all board callback*/
					allBoardChangeCallbacks.push(func);
					return;
				}
				
				throw new TypeError("AddChangeCallback takes a board id and secondly a function to be called when ever the pedals on a board are changed, or just a function to be called on any change from any board");
			}
			
			changeCallbacks[boardId] = changeCallbacks[boardId] || [];
			changeCallbacks[boardId].push(func);
		}
        
        return manager;
	};
		
	return actions;
});