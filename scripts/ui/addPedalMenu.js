define([ "pedalDataAccess", "textResources", "helperMethods", "jquery", "jquery-ui" ], function ( Pedals, resources, helpers, $ ) {
	"use strict";
	
	var methods = {};
	
	methods.create = function (link, addPedalCallback) {
		var errorDisplay = $("<div>", { "class": "error-display" })
			.click(function () {
				searchBox.focus();
			});
			
		function error (msg) {
			errorDisplay
				.prependTo(thisMenu)
				.text(msg);		
		}
		
		function save(isBlurAndSearchBox) {
			var name = searchBox.val().trim().toLowerCase();
			errorDisplay.remove();			
			
			if (name === "") {
				if (isBlurAndSearchBox)
					return thisMenu.remove();
				
				return error(resources.pedalSearchNoInputMessage);
			}

			/* find pedals containing the search string in there name */
			var newPedal = helpers.single(
				helpers.where(Pedals.allPedals, function (pedal) {
					return pedal.fullName.toLowerCase().indexOf(name) !== -1;
				}), 
				function () { /* Too many results */
					error(resources.pedalSearchAmbiguousNameMessage);
				},
				function () { /* No results */
					error(resources.pedalSearchNoResultsMessage);
				});
			
			if (helpers.isUndefined(newPedal)) /* The pedal name wasn't valid */
				return;
			
			searchBox.val("");
			addPedalCallback(newPedal);
		}
		
		var allPedalNames = helpers.select(Pedals.allPedals, function (pedal) {
			return pedal.fullName;
		});
		
		var container = $("<div>", { "class": "no-hover" });
		
		var searchBox = $("<input>", { type: "text", placeholder: resources.pedalSearchPlaceholder, 'class': "pedal-search" })
			.appendTo(container)
			.autocomplete({ /* The search box should autocomplete pedal names */
				source: function(request, response) {
					var results = $.ui.autocomplete.filter(allPedalNames, request.term);
					response(results.slice(0, 10));
				},
				/*select: function (e, ui) {
					searchBox.val(ui.item.value);
					save();
					return false;
				},*/
			});
		
		var addIcon = $("<i>", { "class": "fa fa-plus float-right" })
			.appendTo(container);
		
		searchBox.add(addIcon)
			.click(save)
			.blur(function () {
				save(searchBox.is(this)); 
			})
			.keypress(function (e) {
				if (e.keyCode === 13)/* enter */
					save();
			});
		
		var thisMenu = $("<div>", { "class": "options-menu shadowed " })
			.append(container)
			.insertBefore(link);
		
		searchBox.focus();
		
		return thisMenu;
	};
	
	return methods;
});