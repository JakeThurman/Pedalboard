define(["pedalBoardClasses", "pedalboardPopup", "pedalRenderer", "changeLogger", "stringReplacer", "textResources"], function (classes, pedalBoardPopup, pedalRenderer, changeLogger, replacer, resources) {
	var actions = {};
		
	actions.create = function () {
		var manager = {};
			
		/* create a logger instance */
		manager.logger = changeLogger.create();
		
		/* Where all of the managed boards are stored */
		var boards = {};
		
		/* helper */
		function assertBoardIdExists(id) {
			if (!boards[id]) 
				throw new Error("A board with id of: \"" + id + "\" does not exist");
		}
			
		/* !Data Methods! */
		/*Get the board with id of @boardId */
		manager.GetBoard = function (boardId) {
			var thisBoard = boards[boardId];
				
			/* if there is no board by this id just return undefined now */
			if (!thisBoard)
				return thisBoard;
				
			/* Vanilla js is cool getBoundingClientRect() gets us all the data we need!*/
			var rect = boards[boardId].dom.el.get(0).getBoundingClientRect();
			
			thisBoard.clientRect = {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
			};
				
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
					if (!where || where(boards[key])) /* if there is no where statement, or this one counts */
						return true; /* if any return true of the first one */
				}
			return false;
		};
		
		/* Are there multiple boards [where func]? */
		manager.Multiple = function (where) {
			var any = false;
			for (var key in boards) {
				if (where && !where(boards[key]))
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
	
		/* ! Board Methods ! */
		/* logging helper to reduce duplicate code */
		function log(resource, params) {
			manager.logger.log(replacer.replace(resource, params), manager.GetBoards());
		}
		
		/* Add a board! */
		manager.Add = function (name, contentConatiner) {	
			var domboard = pedalBoardPopup.create(name, contentConatiner, manager);
		
			boards[domboard.options.id] = { 
				dom: domboard,
				data: new classes.PedalBoard(name),
				__pedalEls: [], /* we use this for caching the rendered pedals so that we can easily access them for removing/clearing */
			};
			
			log(resources.change_AddBoard, name);
			
			return domboard;
		};
		
		/* Rename a board */
		manager.Rename = function (name, boardId) {
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var oldName = boards[boardId].data.Name;
			
			boards[boardId].data.Name = name;
			log(resources.change_RenamedBoard, [ oldName, name ]);
		};
		
		/* Delete a board */
		manager.Delete = function (boardId) {			
			assertBoardIdExists(boardId);
			
			/* record so we can log the change in a second */
			var name = boards[boardId].data.Name;
					
			boards[boardId].dom.el.remove();
			delete boards[boardId];
							
			log(resources.change_DeleteBoard, name);
		};
		
		/* Delete all of the boards */
		manager.DeleteAll = function () {
			
			manager.logger.dontLog(function () { /* don't log the individual changes here */
				for(var key in boards)
					manager.Delete(key);
			});
			
			log(resources.change_DeleteAllBoards);
		};
		
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
			
			log(resources.change_AddPedal, [ pedal.fullName, boards[boardId].data.Name ]);
			
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
			log(resources.change_RemovedPedal, [ removedPedal.fullName, boards[boardId].data.Name ]);
		};
			
		/* Clear the board with id of @boardId of all pedals*/
		manager.Clear = function (boardId) {
			assertBoardIdExists(boardId);			
			
			/*remove the pedals from the dom */
			for (var i = 0; i > boards[boardId].__pedalEls.length ;i++) {
			    boards[boardId].__pedalEls[i].remove()
			}			
			/* reset the dom container */
			boards[boardId].__pedalEls = []; 
			
			/* clear the data pedals from the data board */
			boards[boardId].data.Clear();
			
			log(resources.change_ClearedBoard, boards[boardId].data.Name);
		};
        
        return manager;
	};
		
	return actions;
});