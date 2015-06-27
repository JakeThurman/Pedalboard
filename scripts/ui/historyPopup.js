define([ "_Popup", "textResources", "jquery", "helperMethods", "moment" ], function ( _Popup, resources, $, helpers, moment ) {
	"use strict";

	var methods = {};

	methods.create = function(changeLog) {
		/* set up the user language for the moment library */
		moment.locale(window.navigator.userLanguage || window.navigator.language)
	
		var content = $("<div>", { "class": "history-popup" })
		
		function renderChange(change) {
			var changeDiv = $("<div>");
			
			var description = $("<div>", { "class": "description" })
					.text(change.description)
					.appendTo(changeDiv);
						
			if (change.isBatch) {
				var expander = $("<i>", { "class": "float-left fa fa-plus-square" });
				
				expander.add(description)
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
				console.log(change.timeStamp);
				
				changeDiv.append($("<div>", { "class": "time-stamp" })
					.text(new moment(change.timeStamp).fromNow()))
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