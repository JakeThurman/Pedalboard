define(["helperMethods", "textResources"], function (helpers, resources) {
    var methods = {};
		
		var pedalStorageName = "pedalboardData";
		
		methods.supports_html5_storage = function() {
        try { return 'localStorage' in window && window['localStorage'] !== null; } 
			  catch (e) { return false; }
    }
		
		methods.Clear = function() {
		    delete localStorage[pedalStorageName];
		};
		
		methods.Save = function(manager) {
		    if (methods.supports_html5_storage())
		        localStorage[pedalStorageName] = JSON.stringify(manager.GetBoards());
		};
		
		/* Helper for methods.Restore */
		methods.GetBoardStorage = function() {
		    /* if the browser supports storing data and there is data stored*/
		    if (methods.supports_html5_storage() && localStorage[pedalStorageName]) { 
				    return JSON.parse(localStorage[pedalStorageName]); /* return the stored data */
				}
				else { /* Get the default board */
				    return [{
						    dom: {
								    el: [],
										options: {
												id: "pedal-board-DEFAULT"
										}
								},
						    data: {
						        Name: resources.defaultPedalBoardName,
								    pedals: [],
								},
								clientRect: {
								    left: "10px",
										top: "49px",
										width: "509px",
										height: "306px"
								},
						}]
				}
		}
		
		/*
		 * Restores the last browser save state, or the default state.
		 *
		 * @manager:          an instance of pedalboardmanager.js to restore to.
		 * @contentContainer: $object of the container for the pedal boards.
		 */
		methods.Restore = function(manager, contentContainer) {				
				/*loop through each of the boards*/
			  helpers.forEach(methods.GetBoardStorage(), function (board) {
						/* add the board */
				    var domBoard = manager.Add(board.data.Name, contentContainer);
						
						/* TODO: don't hard code this lookup for the content region */
						var pedalContainer = domBoard.el.find(".pedal-board");
						
						/* Place and size the popup as it priviously was */
						domBoard.el.css(board.clientRect);
												
						/* loop through each of the pedal so we can add them to the board */
						helpers.forEach(board.data.pedals, function (pedal) {
						    manager.AddPedal(pedal, domBoard.dom.options.id, pedalContainer);
						});
				});
		};
		
		return methods;
});