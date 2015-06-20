define(["_Popup", "addPedalPopup", "_OptionMenu", "jquery", "helperMethods", "textResources", "pedalRenderer", "pedalboardPopupOptionsHandler", "jquery-ui"], function (_Popup, addPedalPopup, _OptionMenu, $, helpers, resources, pedalRenderer, pedalboardPopupOptionsHandler) {
		var methods = {};
		
		/*Make sure the window nextNewPedalBoardIdoardId value is setup*/
		if (window && !window.nextNewPedalBoardId)
			 window.nextNewPedalBoardId = 1;
		
		/*Params: (for callbacks: note the dom is auto-updated)
		 *  @title: The inital title for the pedal board
		 *  @appendTo: the main dom object to append and limit this board to.
		 *  @callbacks: object with callback functions
		 *      Params:
		 *          @addPedal: 
		 *		    	    Params: @pedal:    the new pedal object
		 *          @deletePedal: 
		 *			         Params: @pedalId: the deleted pedal object's id
		 *          @deleteBoard: 
		 *               Params: @boardId: the id of the pedalboard deleted.
		 *          @rename:
		 *               Params: @name:    the new name of the board.
		 *                       @boardId: the id of the pedalboard renamed.
		 *          @clear: 
		 *		        	 Params: @boardId: the id of the pedalboard cleared.
		 *          @delete:
		 *  @helpActions: object with bool returning help functions
		 *      Params:
		 *          @anyPedals: 
		 *              Params: @boardId: the id of this board.
		 */
		methods.create =  function (title, appendTo, callbacks, helpActions) {
			 if (!callbacks) { callbacks = {}; }
		
			 var content = $("<div>", { "class": "pedal-board" });
		
			 var menuButton = $("<i>", { "class": "fa fa-bars" });
					 
	 		 var popup = _Popup.create(content, {
					  renameable: true,
						rename: callbacks.rename,
					  resizable: true,
						moveable: true,
						//TODO: movecontain: methods.toAppendTo,
						id: "pedal-board-" + window.nextNewPedalBoardId++,
						title: title,
						header: menuButton,
						init: init
			 });
			 
       var deleteAction  = function( event, ui ) {
			     var id = pedalRenderer.getId(ui.draggable);
             ui.draggable.remove();
					 
					 if (callbacks.deletePedal)
					     callbacks.deletePedal(id, popup.options.id);
							 
						/* do this in a try catch because it does not matter if it fails */
					 try { delete allPedal[ui.draggable] }
					 catch (e) {}
			 };
			 
			 /* So we can clear all easily */
			 var allPedals = [];		 
			 /* Add a trash can icon we can use to delete pedals */
			 var trashCan = $("<i>", { "class": "fa fa-trash" });
			 
			 /*Make the pedals sortable*/
			 content.sortable({
			     containment: popup.el,
					 axis: "y",
					 start: function (e, ui) {
					     trashCan.appendTo(content)
									 .droppable({
                       hoverClass: "trash-hover",
            			     drop: deleteAction
                   });
					 },
					 stop: function (e, ui) {
					     trashCan.remove();
					 },
			 });
			 
			 var addPedalToBoard = function(pedal) {
			 		 var newpedal = pedalRenderer.render(pedal)
					 		 .appendTo(content);
					 	
					 /* store so we can clear easily */
					 allPedals.push(newpedal);
						
			 		 /*Call back!*/
					 if (callbacks.addPedal)
			 		 		callbacks.addPedal(popup.options.id, pedal);
			 };
			 
			 var optionsMenuCallbacks = helpers.clone(callbacks);
			 optionsMenuCallbacks.addPedal = addPedalToBoard;
			 
			 var remover = function () {
			     popup.el.remove();
			 };
			 
			 var clearer = function () {
           helpers.forEach(allPedals, function (pedal) {
               pedal.remove();
           });
			 };
			 
			 menuButton.click(function () {			 
          pedalboardPopupOptionsHandler.handle(popup.options.id, menuButton, remover, clearer, helpActions, optionsMenuCallbacks);
			 });
			 
			 function init(popup) {
  			 	popup.el.appendTo(appendTo);
					popup.el.css("position","absolute");
			 }
							 
			 /* return the popup */
			 return popup;
		};
		
		return methods;
});
