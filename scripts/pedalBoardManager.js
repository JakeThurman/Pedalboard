define(["mainPageMenuHandler", "pedalboardClasses"], function (mainPageMenuHandler, classes) {
    var methods = {};
		
		var boards = {};
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
		    boards[boardId].data.pedals.length > 0;
		};
    
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
		
		methods.AddPedal = function (boardId, pedal) {
		    boards[boardId].data.Add(pedal);
		};
		
		methods.DeleteAll = function () {
		    for(var key in boards)
						methods.Delete(key);
		};
				
		methods.Clear = function (boardId) {
		    boards[boardId].data.Clear();
		};
    
    return methods;
});