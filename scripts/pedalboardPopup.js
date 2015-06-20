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
		
			 var menuButton = $('<svg class="float-right menu-icon" version="1.1" x="0px" y="0px" viewBox="0 0 70.627 62.27" enable-background="new 0 0 70.627 62.27" xml:space="preserve">' + 
			 		  "<g>" +
	 		 		 			 "<rect width='70.627' height='12.669'/>" +
								 "<rect y='24.8' width='70.627' height='12.67'/>" + 
	               "<rect y='49.601' width='70.627' height='12.669'/>" + 
			  	  "</g>" +
			 "</svg>");
					 
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
			 
			 /*Make the pedals sortable*/
			 content.sortable({
			     containment: popup.el,
					 axis: "y"
			 });
			 			 	
			 var originalAddCallback = callbacks.addPedal;
			 var addPedalToBoard = function(pedal) {
			 		 pedalRenderer.render(pedal)
					 		 .appendTo(content);
					 					 
			 		 /*Call back!*/
					 if (originalAddCallback)
			 		 		originalAddCallback(popup.options.id, pedal);
			 }
			 
			 callbacks.addPedal	= addPedalToBoard;
			 
			 var remover = function () {
			     popup.el.remove();
			 };
			 
			 menuButton.click(function () {			 
          pedalboardPopupOptionsHandler.handle(popup.options.id, menuButton, remover, helpActions, callbacks);
			 });
			 
			 function init(popup) {
  			 	popup.el.appendTo(appendTo);
					popup.el.css("position","absolute");
			 }
							 
			 /*return the popup*/
			 return popup;
		};
		
		return methods;
});
