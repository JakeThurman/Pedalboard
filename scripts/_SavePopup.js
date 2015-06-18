define(["_Popup", "jquery", "textResources"], function (_Popup, $, resources) {
			var methods = {};
			
			methods.assertOptionValidity = function(options) {
					_Popup.assertOptionValidity(options);
					
					if (!options.save)
						 throw "save option is required";
			}
			
			//Pass it on!
			methods.close = _Popup.close;
			
			///Content [JQuery Array]:	
			///			$("#popup-data");
		  ///
			///Options {object}: {
			///			title: 			(String) 	[Required]  Popup Title
			///			id: 				(Any) 		[Required]	Auto closes the popup of that id if it tries to open again (so the icon will close & so no duplicates)
			///			renameable: (Boolean) {false} 	  Is this user renamable?
			///			moveable: 	(Boolean) {false} 	  Is this user movable?
			///			movecontain:($) 				 			 				 Movement containment selector
		  ///			resizable:  (Boolean) {false} 	  Is this user resizeable?
	  	///			footer:			($object) 					  Appended as a global footer for the popup
			///			saveText:		(String)  {"Save"}	  Text on the save button
			///			cancelText: (String)  {"Cancel"}  Text for the cancel button
		  ///			init: 			(function)						Safe place to put logic done after popup create 
		  ///																								 		 Param: _Popup object of this pedal (See top)
		  ///		  save:				(function)						Save logic -> called on save button click.				
			///																						  		 	 Param: Failure function, call on error to prevent close.				 
  	  ///}; 
			methods.create = function(content, options) {
							methods.assertOptionValidity(options);
							
							var saveFooter = $("<div>")
							
							var saveButton = $("<button>")
									.text(options.saveText || resources.save)
									.appendTo(saveFooter)
									.click(function () {
												var closeMe = true;
												options.save(function () { closeMe = false; }); // failure function!
												
												if (closeMe)
													  methods.close(options.id);
									});
									
							var cancelButton = $("<button>")
									.appendTo(saveFooter)
									.text(options.cancelText || resources.cancel)
									.click(function () {
											methods.close(options.id);
									});
							
							//Add the footer to the options object
							if (options.footer)
								 	options.footer.add(saveFooter);
						  else 
									 options.footer = saveFooter;
							
							return _Popup.create(content, options);
			};
			
			return methods;
});