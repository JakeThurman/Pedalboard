define(["jquery", "helperMethods", "jquery-ui"], function ($, helpers) {
	  var openPopups = {};
		
		var methods = {};
		
		methods.close = function(popupId) {
				openPopups[popupId].el.remove();
				delete openPopups[popupId];
		}
		
		methods.assertOptionValidity = function(options) {
				var errorMessage = "";
		
				if (!options)
					 errorMessage += "options is required! ";
				if (!options.title)
					 errorMessage += "options.title is required! ";
			  if (!options.id)
					 errorMessage += "options.id is required! ";
					 
				if (errorMessage != "")
					 throw errorMessage;
		}
		
		//Class		
		function _Popup(el, options) {
		   this.el = el;
			 this.options = options;
		}
  	 ///Content [JQuery Array]:	
  	 ///			$("#popup-data");
     ///
  	 ///Options {object}: {
  	 ///			title: 			(String) 	[Required] 	     Popup Title
  	 ///			id: 				(Any) 		[Required]			 Auto closes the popup of that id if it tries to open again (so the icon will close & so no duplicates)
  	 ///			renameable: (Boolean) {Default: false} Is this user renamable?
  	 ///			moveable: 	(Boolean) {Deault: false}  Is this user movable?
		 ///			movecontain:($) 				 			 				 Movement containment selector
  	 ///			resizable:  (Boolean) {Default: false} Is this user resizeable?
  	 ///			footer:			($object) 					 			 Appended as a global footer for the popup
		 ///			header: 		($object) 								 Appended to the header and floated to the right 
		 ///			init: 			(function)								 Safe place to put logic done after popup create 
		 ///																								 		 Param: _Popup object of this pedal (See top)
  	 ///};
  		 methods.create = function (content, options) {  	 
  	 				 //Make sure the options are valid.
  	 				 methods.assertOptionValidity(options);
  	 				 
  					 if (openPopups[options.id])
  					 		return methods.close(options.id);
  					 
  					 //Create the popup
  					 var popup = $("<div>", { "class": "output-box shadowed" });
  					
  					 //Create the header 
  					 var header = $("<div>", { "class": "header" })
						 		 .appendTo(popup);
								 
						 if (options.header)
						 		 options.header.appendTo(header);
  					 
  					 var title = $("<h2>")
  					 		 .text(options.title)
  					 		 .appendTo(header);
  							 
  					 //Create the content container
  					 var allContent = $("<div>", { "class": "content" })
  				 		 .append(content)
							 .appendTo(popup);
  							
  					 if (options.footer)
  					 		popup.append(options.footer.addClass("footer"));
  							
  					 //Add rename functionality if needed
  					 if (options.renameable) {
  					 	  var switchBack = function () {
  								  title.text(renameBox.val());
  								  renameBox.replaceWith(title);
  								
  								  if (options.header)
  		 		  				    options.header.show();
  							}
								
								var renameBox = $("<input>", { type: "text" })
  									.val(title.text())
  									.blur(switchBack)
										.keyup(function (e) {
												if (e.keyCode === 13)
													 switchBack();
										});
										
								
								
  					 		title.addClass('renameable')
  									.click(function () {
  											title.replaceWith(renameBox);
												renameBox.focus();
												
												if (options.header)
						 		  				 options.header.hide();
  									});
  					 }
  				 
  				 //Add moveable if needed
  				 if (options.moveable)
  				 		popup.draggable({ 
									handle: ".header",
									containment: options.movecontain,
							});
  						
  				 //Add resizeable if needed
  				 if (options.resizable){
  				 		popup.resizable({ 
                    minHeight: 75,
                    minWidth: 100,
										maxHeight: 500,
      							maxWidth: 700,
  						});
  				 }
					 
  				 //Save the data
  				 var outputPopup = new _Popup(popup, options);
  					 
					 //Init! -> Do this for safe logic that won't get called if the popup gets closed!
					 if (options.init)
					    options.init(outputPopup);
						 
  				 //record that this popup is open
  				 openPopups[options.id] = outputPopup;
  					 
  				 //return the popup
  				 return outputPopup; //remeber this is undefined on close!
  	 } 

		 return methods;
});