define(["jquery", "helperMethods"], function ($, helpers) {
    var methods = {};
				
		/*
		 * @params
		 * 				optionLinks: ($)            Items to be appended to the menu 
		 * 				link:        ($) {optional} The refurring link, skip to avoid positioning
		 *
		 * @returns: $(menu)
		 */
  	methods.create = function (optionLinks, link) {		
  			 var el = $("<div>", { "class": "options-menu shadowed" })
             .append(optionLinks);
						 
				 if (link) {
             el.insertBefore(link)
						     .position({
                     my: "top center",
                     at: "bottom center",
                     of: link
                 }).css("top", ""); /*Clear top prop, */
				 }
				 else
				     el.appendTo(document.body);
				 
		     setTimeout(function () {
  			     $(document).one("click", function () {
                 el.remove();
  			     });
				 }, 0);/*Keeps jquery from firing on this click event*/
							
				 return el;
  	};
  
  	return methods;
});
