define(["_Popup", "addPedalPopup", "_OptionMenu", "jquery", "textResources", "pedalRenderer", "pedalboardPopupOptionsHandler", "jquery-ui"], function (_Popup, addPedalPopup, _OptionMenu, $, resources, pedalRenderer, pedalboardPopupOptionsHandler) {
		var methods = {};
		
		/*Make sure the window nextNewPedalBoardIdoardId value is setup*/
		if (window && !window.nextNewPedalBoardId)
			 window.nextNewPedalBoardId = 1;
		
		/*Params:
		 *  @title:    the inital title for the pedal board
		 *  @appendTo: the main dom object to append and limit this board to.
		 *  @manager:  the pedalBoardManager.js instance that created this
		 */
		methods.create =  function (title, appendTo, manager) {		
			 var content = $("<div>", { "class": "pedal-board" });
		
			 var menuButton = $("<i>", { "class": "fa fa-bars" });
					 
	 		 var popup = _Popup.create(content, {
					  renameable: true,
						rename: function (name, boardId) { manager.Rename(name, boardId); },
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
					 
				   manager.DeletePedal(id, popup.options.id);
			 };
			 	 
			 var trashCan = $("<i>", { "class": "fa fa-trash" });
			 
			 /* Make the pedals sortable */
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
			 
			 menuButton.click(function () {			 
          pedalboardPopupOptionsHandler.handle(popup.options.id, menuButton, 
    			    function () { /* deleter */
      			      manager.Delete(popup.options.id);
      		    }, 
              function () { /* clearer */
        			    manager.Clear(popup.options.id);
              },
							function (pedal) { /* adder */
							    manager.AddPedal(popup.options.id, pedal);
									pedalRenderer.render(pedal).appendTo(content);
							});
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
