define(["jquery", "helperMethods"], function ($, helpers) {
    var methods = {};
  	
		/// link:        ($) The refurring link
		/// optionLinks: ($) Items to be appended to the menu 
		///
		/// @returns: $(menu)
  	methods.create = function (link, optionLinks) {
  				var el = $("<div>", { "class": "options-menu shadowed" })
					    .append(optionLinks)
							.insertBefore(link)
					    .position({
      				    my: "top right",
      						at: "bottom right",
      						of: link
      				});
							
				 return el;
  	};
  
  	return methods;
});
