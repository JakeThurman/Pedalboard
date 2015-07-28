define(["jquery"], function ($) {
	"use strict";
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

		if (link)
            el.insertBefore(link);
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
