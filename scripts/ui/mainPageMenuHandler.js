define(["textResources", "_OptionMenu", "jquery"], function (resources, _OptionMenu, $) {
    var methods = {};
		
	/*
	 * @pageMenuButton:       the menu button that triggered this
	 * @manager:              pedalBoardManager.js object to manage pedal boards with
	 * @openHistory:          calling this should open the history popup
	 */
	methods.handle = function(pageMenuButton, manager, openHistory) {
		var addBoardButton = $("<div>")
			.text(resources.addPedalBoardButtonText)
			.click(function () {
				var newNameBox = $("<input>", { type: "text", "class": "no-hover", placeholder: resources.newBoardNamePlaceholder })

				var nameMenu = _OptionMenu.create(newNameBox).addClass("main-page-menu");

				var addPedalBoardEvent = function () {
					var name = newNameBox.val();
					/* If they didn't even give us a name, don't bother creating a board */
					if (!name)
						return;

					manager.Add(name);
					/* we're done here! */
					nameMenu.remove();
				};

				newNameBox.blur(addPedalBoardEvent)
					.click(addPedalBoardEvent)
					.keyup(function (e) {
						if (e.keyCode == 13)/* enter */
							addPedalBoardEvent();   
					})
					.focus();
			});
				
		var deleteAllBoards = $("<div>")
			.text(resources.clearAllBoards)
			.click(function () {
				if (confirm(resources.clearAllBoardsConfirm))
					manager.DeleteAll();
			});
			
		var historyButon = $("<div>")
			.text(resources.historyPopupTitle)
			.click(openHistory);

		var menuOptions = addBoardButton.add(historyButon);

		if (manager.Any())
			menuOptions = menuOptions.add(deleteAllBoards);

		_OptionMenu.create(menuOptions).addClass("main-page-menu fixed");
	};
		
    return methods;
});