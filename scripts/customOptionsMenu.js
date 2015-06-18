define(["jquery", "helperMethods"], function ($, helpers) {
    var methods = {};
  	
  	methods.create = function (link, buttons) {
  				return $("<div>", { "class": "custom-options-menu" })
					    .append(buttons)
							.insertBefore(link)
					    .position({
      				    my: "top right",
      						at: "bottom right",
      						of: link
      				});
  	};
  
  	return methods;
});
