define(["jquery", "helperMethods"], function ($, helpers) {
    var methods = {};
  	
		/*
		 * @params
		 * 				link:        ($) The refurring link
		 * 				optionLinks: ($) Items to be appended to the menu 
		 *
		 * @returns: $(menu)
		 */
  	methods.create = function (link, optionLinks) {
  				var el = $("<div>", { "class": "options-menu shadowed" })
					    .append(optionLinks)
							.insertBefore(link)
					    .position({
      				    my: "top center",
      						at: "bottom center",
      						of: link
      				})
							.css("top", ""); /*Clear top prop, */
				 
		     setTimeout(function () {
  			     $(document).one("click", function () {
                 el.remove();
  			     });
				 }, 0);/*Keeps jquery from firing on this click event*/
							
				 return el;
  	};
  
  	return methods;
});
