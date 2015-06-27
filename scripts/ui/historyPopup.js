define([ "_Popup", "textResources", "jquery", "helperMethods" ], function ( _Popup, resources, $, helpers ) {
	"use strict";

	var methods = {};

	methods.create = function(changeLog) {
		var content = $("<div>", { "class": "history-popup" })
		
		function renderChange(change) {
			var changeDiv = $("<div>")
				.append($("<div>", { "class": "description" })
					.text(change.description));
						
			if (change.isBatch) {
				var expander = $("<i>", { "class": "float-left fa fa-plus-square" })
					.click(function () {
						changeDiv.toggleClass("expanded");
						expander.toggleClass("fa-plus-square")
							.toggleClass("fa-minus-square");
					});
								
				changeDiv.prepend(expander)
					.addClass("batch");
					
				helpers.forEach(change.changes, function (subChange) {
					changeDiv.append(renderChange(subChange));
				});
			}
			else {
				changeDiv.append($("<div>", { "class": "time-stamp" })
					.text("[" + change.timeStamp + "]"))
					.addClass("change");
			}
			
			return changeDiv;
		}
		
		function appendChange(change) {
			content.append(renderChange(change));
		}
		
		helpers.forEach(changeLog, appendChange);
		
		function init(popup) {
			popup.el.appendTo(document.body)
				.addClass("history-popup-outer")
				.draggable({ 
					handle: ".header",
				});
		}
		
		var popup = _Popup.create(content, {
			title: resources.historyPopupTitle,
			id: "history",
			init: init
		});
		
		return {
			popup: popup,
			addChange: appendChange,
		}
	};
	
	return methods;
});