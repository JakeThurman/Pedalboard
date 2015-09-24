define([ "jquery", "_Popup", "textResources", "changeTypes", "objectTypes" ], function ( $, _Popup, resources, changeTypes, objectTypes ) {
	"use strict";

	var methods = {};
	
	/*
	 * Starts a tutorial
	 * 
	 * PARAMS: 
	 *   @logger:     The logger instance to use for logging changes.
	 *   @parentNode: The DOM node to append the popup to.
	 *
	 * @returns: _Popup object for the popup.
	 */
	methods.create = function (logger, parentNode) {
		
		var content = $("<div>");
				
		var init = function (popup) {
			
			popup.el.appendTo(parentNode)
			
			logger.log(changeTypes.add, objectTypes.tutorial, popup.id);
			
		};
		
		var close = function (popup) {
			
			logger.log(changeTypes.remove, objectTypes.tutorial, popup.id);
			
		};
		
		return _Popup.create(content, {
			
			title: resources.tutorialTitle,
			init: init,
			close: close,
			id: "tutorial",
			
		});
	};
	
	
	return methods;
});