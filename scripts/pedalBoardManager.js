define(["pedalboardClasses", "pedalBoardPopup"], function (classes, pedalBoardPopup) {
    var actions = {};
		
		actions.create = function () {		
		    var manager = {};
		    
    		/* Where all of the managed boards are stored */
    		var boards = {};
    		
    		/* !Data Methods! */
    		/*Get the board with id of @boardId */
    		manager.Board = function (boardId) {
    		    var thisBoard = boards[boardId].data;
    				
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
    	  manager.Boards = function () {
    		    var out = [];
    				for(var key in boards) {
    				    out.push(manager.Board(key));
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
    		    return boards[boardId].data.pedals.length > 0;
    		};
        
    		/* !Board Methods! */
    		/* Add a board! */
        manager.Add = function (name, contentConatiner) {
    		    var domboard = pedalBoardPopup.create(name, contentConatiner, manager);
    		
    		    boards[domboard.options.id] = { 
    				    dom: domboard,
    						data: new classes.PedalBoard(domboard.options.title)
    			  };
    		};
    		
    		/* Rename a board */
    		manager.Rename = function (name, boardId) {
    		    boards[boardId].data.Name = name;
    		};
    		
    		/* Delete a board */
    		manager.Delete = function (boardId) {
    		    boards[boardId].dom.el.remove();
    				delete boards[boardId];
    		};
    		
    		/* Delete all of the boards */
    		manager.DeleteAll = function () {
    		    for(var key in boards)
    						manager.Delete(key);
    		};
    		
    		/* !Pedal Methods! */
    		/* Add the passed in pedal object to the board with id of @boardId */
    		manager.AddPedal = function (boardId, pedal) {
    		    boards[boardId].data.Add(pedal);
    		};
    		
    		/* Remove a pedal with id of @pedal id from the board with id of @boardId. */
    		manager.RemovePedal = function (pedalId, boardId) {
    		    boards[boardId].data.Remove(pedalId);
    		};
    	  
    		/* Clear the board with id of @boardId */
    		manager.Clear = function (boardId) {
    		    boards[boardId].data.Clear();
    		};
        
        return manager;
		};
		
		return actions;
});