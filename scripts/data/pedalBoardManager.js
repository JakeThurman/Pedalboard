define(["pedalBoardClasses", "pedalboardPopup", "pedalRenderer", "textResources", "helperMethods", "changeTypes", "batchTypes", "objectTypes"], 
function (classes, pedalBoardPopup, pedalRenderer, resources, helpers, changeTypes, batchTypes, objectTypes) {
	"use strict";
		
	/*
	 * PedalboardManager "class" - To handle all your pedal needs!
	 *
	 * @logger:            Change Logger instance to log changes to
	 * @contentContainer:  The container for added pedalboards in the dom
	 *
	 * @returns:           The manager instance
	 */
	return function (logger, contentContainer) {
		var manager = this;
		
		/* Assert that the logger is valid */
		if (!logger.changes || !logger.log || !logger.batch)
			throw new TypeError("Logger should be a changeLogger object");
		
		/* Where all of the managed boards are stored */
		var boards = {};
		
		/* Validation helper for board ids */
		function assertBoardIdExists(id) {
			if (!boards[id]) 
				throw new Error("A board with id of: \"" + id + "\" does not exist");
		}
		
		/* Partial copy helper for client rects (we don't want all of the properties) */
		function getClientRect(fullRect) {
			return {
				left: fullRect.left,
				top: fullRect.top,
				width: fullRect.width,
			};
		}
		
		/* !Data Methods! */
		/*
		 * Get the board with id of @boardId
		 *
		 * @boardId: The id of the pedalboard to check
		 * @returns: [Object]: {
		 *                        data: [PedalboardClasses.PedalBoard],
		 *                        clientRect: [Object] : {  left: "10px", top: "10px", width: "300px" },
		 *                        id: @boardId,
		 *                     }
		 */
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
		
		/*
		 * Get an array of all of the board data
		 *
		 * @returns: [Array<Object>] : [{
		 *                                data: [PedalboardClasses.PedalBoard],
		 *                                clientRect: [Object] : {  left: "10px", top: "10px", width: "300px" },
		 *                                id: (boardId value),
		 *                             }]
		 */
		manager.GetBoards = function () {
			var out = [];
			for(var key in boards) {
				out.push(manager.GetBoard(key));
			}
			return out;
		};
		
		/*
		 * Are there any boards [where func]?
		 *
		 * @where:   [OPTIONAL] A function returning a boolean to select only some of the boards -> If not provided will check all boards
		 * @returns:            [boolean]
		 */
		manager.Any = function (where) {
			for(var key in boards) {
				if (!where || where(manager.GetBoard(key))) /* if there is no where statement, or this one counts */
					return true; /* if any return true of the first one */
			}
			return false;
		};
		
		/*
		 * Are there multiple boards [where func]?
		 *
		 * @where:   [OPTIONAL] A function returning a boolean to select only some of the boards -> If not provided will check all boards
		 * @returns:            [boolean]
		 */
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
		
		/*
		 * Are there any pedals on the pedalboard with id of @boardId?
		 *
		 * @boardId: The id of the pedalboard to check
		 * @returns: [boolean]
		 */
		manager.AnyPedals = function (boardId) {
			var board = boards[boardId];
			return board ? board.data.pedals.length > 0 : false; /* If there is no board with this id return false */
		};
		
		/*
		 * Are there multiple pedals on the pedalboard with id of @boardId?
		 *
		 * @boardId: The id of the pedalboard to check
		 * @returns: [boolean]
		 */
		manager.MultiplePedals = function (boardId) {
			var board = boards[boardId];
			return board ? board.data.pedals.length > 1 : false; /* If there is no board with this id return false */
		};
	
		/* ! Board Methods ! */		
		/*
		 * Add a pedalboard
		 *
		 * @name:             The name for the pedalboard
		 * @returns:          JQuery $object for the rendered (new) pedalboard
		 */
		manager.Add = function (name) {	
			var domboard = pedalBoardPopup.create(name, contentContainer, manager, logger);
		
			boards[domboard.id] = { 
				dom: domboard,
				data: new classes.PedalBoard(name),
				id: domboard.id,
				__pedalEls: [], /* we use this for caching the rendered pedals so that we can easily access them for removing/clearing */
			};
			
			logger.log(changeTypes.add, objectTypes.pedalboard, domboard.id, void(0), helpers.clone(manager.GetBoard(domboard.id)), name);
			
			return domboard;
		};
		
		/*
		 * Rename a board
		 *
		 * @name:    The new name for the pedalboard
		 * @boardId: The id of the pedalboard to update the name of 
		 */
		manager.Rename = function (name, boardId) {
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var oldName = boards[boardId].data.Name;
						
			/* update the saved data object */
			boards[boardId].data.Name = name;

			/* log this change to the history */
			logger.log(changeTypes.rename, objectTypes.pedalboard, boardId, oldName, name, name, oldName);
		};
		
		/*
		 * Delete board from the page
		 *
		 * @boardId: The id of the pedalboard to delete
		 */
		manager.Delete = function (boardId) {			
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var boardToLog = manager.GetBoard(boardId);
			
			boards[boardId].dom.el.remove();
			delete boards[boardId];
							
			logger.log(changeTypes.remove, objectTypes.pedalboard, boardId, boardToLog, void(0), boardToLog.data.Name);
		};
		
		/* Delete all of the boards on the page. */
		manager.DeleteAll = function () {
			logger.batch(batchTypes.deleteAll, objectTypes.pedalboard, function () { /* log deleting each board as a batch */
				for(var key in boards)
					manager.Delete(key);
			});
		};
		
		/* ! Board-UI Logging Methods ! */
		/* Quick helper to check (for chrome and firefox) if the client rect object is valid */
		function assertClientRectIsValid(clientRect) {		
			if (helpers.isUndefined(clientRect.left) || helpers.isUndefined(clientRect.top) || helpers.isUndefined(clientRect.width))
				throw new TypeError("@clientRect is not a valid. Try using (vanilla js element).getBoundingClientRect()");
		}
		
		/*
		 * Log a board as moved
		 *
		 * @boardId:    The id of the pedalboard to record as moved
		 * @clientRect: The javascript client rect object received from ([VANILLA JS DOM ELEMENT].getBoundingClientRect()) where the dom element is the pedalboard
		 * @setCss:     [DEFAULT=true] Should this set the client rect to the css of the dom?
		 */
		manager.Move = function (boardId, clientRect, setCss) {
			changeVisual(boardId, clientRect, setCss, changeTypes.move);
		};
		
		/*
		 * Log a board as resized
		 *
		 * @boardId:    The id of the pedalboard to record as resized
		 * @clientRect: The javascript client rect object recieved from ([VANILLA JS DOM ELEMENT].getBoundingClientRect()) where the dom element is the pedalboard
		 * @setCss:     [DEFAULT=true] Should this set the client rect to the css of the dom?
		 */
		manager.Resize = function (boardId, clientRect, setCss) {
			changeVisual(boardId, clientRect, setCss, changeTypes.resize);
		};
		
		/* Helper, factoring out .Move and .Resize shared code. */
		function changeVisual(boardId, clientRect, setCss, changeType) {
			assertBoardIdExists(boardId);
			assertClientRectIsValid(clientRect);
			
			/* Save the before value so we can log it in a second */
			var oldValue = manager.GetBoard(boardId).clientRect;
			
			boards[boardId].clientRect = getClientRect(clientRect);
			
			if (setCss !== false) /* We default to true, so just check against false */
				boards[boardId].dom.el.css(boards[boardId].clientRect); /* Force make this true */
			
			logger.log(changeType, objectTypes.pedalboard, boardId, oldValue, boards[boardId].clientRect, boards[boardId].data.Name);
		}
		
		/*
		 * Clear the board with id of @boardId of all pedals
		 *
		 * @boardId: The id of the pedalboard to clear all pedals from
		 */
		manager.Clear = function (boardId) {
			assertBoardIdExists(boardId);
			
			logger.batch(batchTypes.clearBoard, objectTypes.pedalboard, boardId, boards[boardId].data.Name, function () {
				var pedalsCount = boards[boardId].data.pedals.length;
				for (var i = 0; i < pedalsCount; i++) {
					manager.RemovePedal(0, boardId);
				}
			});
		};
		
		/* ! Pedal Methods ! */		 
		/*
		 * Add the passed in pedal object to the board with id of @boardId. 
		 * Optionally then appends the created dom element to @pedalContainer 
		 *
		 * @pedal:          The pedal object to add to the board
		 * @boardId:        The id of the pedalboard to add the pedal to
		 *
		 * @returns:        JQuery $object of the rendered pedal.
		 */
		manager.AddPedal = function (pedal, boardId) {
			assertBoardIdExists(boardId);
			
			/* render the pedal */
			var rendered = pedalRenderer.render(pedal);
			
			/* add the data pedal */
			boards[boardId].data.Add(pedal);
			
			/* log this change to the history */
			logger.log(changeTypes.add, objectTypes.pedal, boardId, void(0), pedal, boards[boardId].data.Name, pedal.fullName);
				
			/* Append the rendered pedal to the container */
			/* TODO: don't hard code this lookup for the content region */
			rendered.appendTo(boards[boardId].dom.el.find(".pedal-board"));
			
			/* Cache it so we can use it for removing/clearing */
			boards[boardId].__pedalEls.push({ o: rendered.get(0), p: rendered.get(0).parentNode });
			
			return rendered;
		};
		
		/*
		 * Remove a pedal with id of @pedal id from the board with id of @boardId.
		 *
		 * @index:   The index of the pedal to remove from the board
		 * @boardId: The id of the pedalboard to remove the pedal from
		 */
		manager.RemovePedal = function (index, boardId) {	
			assertBoardIdExists(boardId);
			var removedPedal = boards[boardId].data.Remove(index);
			removedPedal.index = index;
			
			/* Kill the dom element */
			var pedalEl = boards[boardId].__pedalEls[index];
			pedalEl.p.removeChild(pedalEl.o);
			var i = 0;
			boards[boardId].__pedalEls = helpers.where(boards[boardId].__pedalEls, function () {
				return i++ !== index;
			});
			
			/* log this change to the history */
			logger.log(changeTypes.remove, objectTypes.pedal, boardId, removedPedal, void(0), boards[boardId].data.Name, removedPedal.fullName);
		};
		
		/*
		 * Moves a pedal at index of @oldPedalIndex to @newPedalIndex on board with id of @boardId
		 *
		 * @oldPedalIndex: The original index of the pedal (BEFORE move), which is the same as the number of pedals above it on the board.
		 * @newPedalIndex: The new index of the pedal (AFTER move), which is the same as the number of pedals above it on the board.
		 * @boardId:       The id of the pedalboard the reordered pedal is a member of
		 */
		manager.ReorderPedal = function (oldPedalIndex, newPedalIndex, boardId) {	
			assertBoardIdExists(boardId);
			
			if (oldPedalIndex < 0 || newPedalIndex < 0)
				throw new Error("Indexes cannot be negative! Old: " + oldPedalIndex + " New: " + newPedalIndex);
			
			/* Only save a change if one was made */
			if (oldPedalIndex === newPedalIndex) return; 
			
			var reorderedPedal = boards[boardId].data.Reorder(oldPedalIndex, newPedalIndex);
			
			/* Reorder the __pedalEls cache */
			{
				/* The pedal to move */
				var movePedal = boards[boardId].__pedalEls[oldPedalIndex];
				
				var moveUp = oldPedalIndex > newPedalIndex;
				var smallerIndex = moveUp
					? newPedalIndex
					: oldPedalIndex;
					
				/* No need to loop through the first part since we'll just copy it straight */
				var orderedPedals = boards[boardId].__pedalEls.slice(0, smallerIndex);
				
				/* loop through the rest to find the pedal that we need to move and move it */
				for (var i = smallerIndex; i < boards[boardId].__pedalEls.length; i++) {
					/* for move up we add this first */
					if (moveUp && i === newPedalIndex)
						orderedPedals.push(movePedal);
					
					if (i !== oldPedalIndex)
						orderedPedals.push(boards[boardId].__pedalEls[i]);
					
					/* for move down we add this after */
					if (!moveUp && i === newPedalIndex)
						orderedPedals.push(movePedal);
				}
				boards[boardId].__pedalEls = orderedPedals;
			}
			
			logger.log(changeTypes.move, objectTypes.pedal, boardId, oldPedalIndex, newPedalIndex, boards[boardId].data.Name, reorderedPedal.fullName);
		};
		
		/*
		 * Import function used for restore 
		 * 
		 * @boards:  The manager.GetBoards() obejct to be imported.
		 * @returns: An array of the created boards.
		 */
		manager.Import = function (boards) {
			/* Create a new board for each, and add all of its pedals */
			return helpers.select(boards, function(board) {
				if (!board || !board.data || !board.clientRect || !board.data.pedals || !board.data.Name)
					throw new TypeError("The board is not valid, it should be an object from manager.GetBoard([id])");
				
				/* Add the board */
				var domBoard = manager.Add(board.data.Name);
				
				/* Place and size the popup as it previously was */
				manager.Move(domBoard.id, board.clientRect);
				manager.Resize(domBoard.id, board.clientRect);
				
				/* Add each of the pedals to the board */
				helpers.forEach(board.data.pedals, function (pedal) {
					manager.AddPedal(pedal, domBoard.id);
				});
				
				return domBoard.id;
			});
		};
	};
});