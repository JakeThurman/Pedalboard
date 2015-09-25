define([ "jquery", "_Popup", "textResources", "changeTypes", "objectTypes" ], function ( $, _Popup, resources, changeTypes, objectTypes ) {
	"use strict";

	var methods = {};
	
	methods.id = "tutorial";
	
	/*
	 * Starts a tutorial
	 * 
	 * PARAMS: 
	 *   @logger: The logger instance to use for logging changes.
	 *   @info:   Object containing properties: .parent  -> The DOM node to append the popup to.
	 *                                          .content -> The pre-generated jquery object for the tutorial content.
	 *
	 * @returns: _Popup object for the popup.
	 */
	methods.create = function (logger, info) {
						
		var init = function (popup) {
			
			popup.el
				.addClass("tutorial-popup-outer above-screen-block")
				.appendTo(info.parent);
			
			logger.log(changeTypes.add, objectTypes.tutorial, popup.id);
			
		};
		
		var close = function (popup) {
			
			logger.log(changeTypes.remove, objectTypes.tutorial, thisPopup.id);
			
		};
		
		var thisPopup = _Popup.create(info.content, {
			
			title: resources.tutorialTitle,
			init: init,
			close: close,
			id: methods.id,
			
		});
		
		return thisPopup;
	};
	
	
	return methods;
});