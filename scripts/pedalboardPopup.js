define(["_Popup", "addPedalPopup"], function (_Popup, addPedalPopup) {
		var methods = {};
		
		//Default value, user overrideable
		methods.toAppendTo = document.body; 
		
		//Make sure the window nextNewPedalBoardIdoardId value is setup
		if (window && !window.nextNewPedalBoardId)
			 window.nextNewPedalBoardId = 1;
		
		//Params:
		//  @title: The inital title for the pedal board
		//  @addPedalCallback: (the visual/dom pedal board is automatically updated)
		//			 Params: @pedal: the new pedal object
		//  @deletePedalCallback: (the visual/dom pedal board is automatically updated)
		//			 Params: @pedal: the deleted pedal object
		methods.create =  function (title, addPedalCallback, deletePedalCallback) {
			 var content = $("<div>");
		
			 var addButton = $('<svg class="float-right menu-icon" version="1.1" x="0px" y="0px" viewBox="0 0 70.627 62.27" enable-background="new 0 0 70.627 62.27" xml:space="preserve">' + 
			 		  "<g>" +
	 		 		 			 "<rect width='70.627' height='12.669'/>" +
								 "<rect y='24.8' width='70.627' height='12.67'/>" + 
	               "<rect y='49.601' width='70.627' height='12.669'/>" + 
			  	  "</g>" +
			 "</svg>");
					 
	 		 var popup = _Popup.create(content, {
					  renameable: true,
					  resizable: true,
						moveable: true,
						//TODO: movecontain: methods.toAppendTo,
						id: "pedal-board-" + window.nextNewPedalBoardId++,
						title: title,
						header: addButton,
						init: init
			 });
			 
			 //Make the pedals sortable
			 content.sortable();
			 
			 var addPedal = function (pedal) {
					 $("<div>", { "class": "single-pedal-data" })
					 			.appendTo(content)
					 			.text("$" + pedal.price + " - " + pedal.fullName);
					 
			 		 //Call back!
					 if (addPedalCallback)
			 		 		addPedalCallback(pedal);
			 };
			 
			 addButton.click(function () {
					addPedalPopup.create(addButton, popup.options.id, addPedal);
			 })
			 
			 function init(popup) {
  			 	popup.el.appendTo(methods.toAppendTo);
			 }
							 
			 //return the popup
			 return popup;
		};
		
		return methods;
});