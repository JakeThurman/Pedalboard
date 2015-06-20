define(["mainPageMenuHandler", "pedalboardClasses"], function (mainPageMenuHandler, classes) {
    var methods = {};
		
		/* Where all of the managed boards are stored */
		var boards = {};
		
		/* Data Methods */
	  methods.Boards = function () {
		    var out = [];
				
				for(var key in boards) {
				    out.push(boards[key]);
				}
				return out;
		};
		
		methods.Any = function () {
		    for(var key in boards) {
				    return true; /*if any return true of the first one*/
				}
				return false;
		};
		
		methods.AnyPedals = function (boardId) {
		    return boards[boardId].data.pedals.length > 0;
		};
    
		/* Board Methods */
    methods.Add = function (domboard) {
		    boards[domboard.options.id] = { 
				    dom: domboard,
						data: new classes.PedalBoard(domboard.options.title)
			  };
		};
		
		methods.Rename = function (name, boardId) {
		    boards[boardId].data.Name = name;
		};
		
		methods.Delete = function (boardId) {
		    boards[boardId].dom.el.remove();
				delete boards[boardId];
		};
		
		methods.DeleteAll = function () {
		    for(var key in boards)
						methods.Delete(key);
		};
		
		/* Pedal Methods */
		methods.AddPedal = function (boardId, pedal) {
		    boards[boardId].data.Add(pedal);
		};
		
		methods.RemovePedal = function (pedalId, boardId) {
		    boards[boardId].data.Remove(pedalId);
		};
				
		methods.Clear = function (boardId) {
		    boards[boardId].data.Clear();
		};
    
    return methods;
});