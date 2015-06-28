define([ "_Popup", "textResources", "jquery", "helperMethods", "moment" ], function ( _Popup, resources, $, helpers, moment ) {
	"use strict";

	var methods = {};

	methods.create = function(changeLog) {
		/* set up the user language for the moment library */
		moment.locale(window.navigator.userLanguage || window.navigator.language)
	
		var content = $("<div>", { "class": "history-popup" })
		
		/* store all of the moment update intervals here so that we can kill them on close */
		var momentUpdateIntervals = [];
		
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
				changeDiv.addClass("change");
					
				var timeStamp = $("<div>", { "class": "time-stamp" })
					.text(new moment(change.timeStamp).fromNow())
					.appendTo(changeDiv);
					
				setInterval(function () { /* every minute, refresh the "from now" */
					timeStamp.text(new moment(change.timeStamp).fromNow());
				}, 60000) /*60,000ms = 1min*/
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
		
		function close(popup) {
			helpers.forEach(momentUpdateIntervals, function (interval) {
				clearInterval(interval);
			});
		}
		
		var popup = _Popup.create(content, {
			title: resources.historyPopupTitle,
			id: "history",
			init: init,
			close: close,
		});
		
		return {
			popup: popup,
			addChange: appendChange,
		}
	};
	
	return methods;
});