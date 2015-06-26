define (["_SavePopup", "textResources", "helperMethods", "pedalDataAccess", "jquery", "jquery-ui"], function (_SavePopup, resources, helpers, Pedals, $) {
	var methods = {};	

	methods.create = function (button, boardId, addPedalCallback, cancelCallback) {
		var content = $("<div>");
			
		var allPedalNames = helpers.select(Pedals.allPedals, function (pedal) {
			return pedal.fullName;
		});
		
		var nameBox = $("<input>", { type: "text", placeholder: resources.pedalSearchPlaceholder, 'class': "pedal-search" })
			.appendTo(content)
			.autocomplete({
				source: allPedalNames
			})
			.keyup(function (e) {
				if (e.keyCode === 13) {//enter
					var failed = false;
					save(function () {failed = true;});
					if (!failed) thisPopup.el.remove();
				}
			});
		  
		var errorDisplay = $("<div>", { "class": "add-error-display" }).appendTo(content);
				
		function error(message){
			errorDisplay.addClass("visible")
				.text(message);
		}
			
		function getNewPedal(name) {
			name=name.toLowerCase();
				
			if (name === ""){
				error(resources.noInputMessage);
					return;
			}

			//find pedals containing that string
			var newPedal = helpers.single(
			helpers.where(Pedals.allPedals, function (pedal) {
					return pedal.fullName.toLowerCase().indexOf(name) !== -1;
				}), 
				function () { //too many results
					error(resources.ambiguousNameMessage);
				},
				function () { //No results
					error(resources.noResultsMessage);
				});
															
			return newPedal;
		}
				
		var save = function (failure) {
			var newPedal = getNewPedal(nameBox.val());
			
			if (helpers.isUndefined(newPedal))
				  failure();
			else
				addPedalCallback(newPedal);
		};
		
		function init(popup) {
			popup.el
				.insertBefore(button)
				.position({
					my: "right top",		
					at: "right bottom",		
					of: button										
				});
		}

		var thisPopup = _SavePopup.create(content, {
			saveText: resources.addPedal,
			save: save,
			id: "AddPedal" + boardId,
			title: resources.addPedal,
			init: init,
			cancel: cancelCallback
		});
		
		return thisPopup;
	};
		 
	return methods;
});