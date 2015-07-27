define(["textResources", "_OptionMenu", "jquery"], function (resources, _OptionMenu, $) {
    var methods = {};
		
	/*
	 * @pageMenuButton:       the menu button that triggered this
	 * @manager:              pedalBoardManager.js object to manage pedal boards with
	 * @undoer:               undoHandler instance
	 * @openHistory:          calling this should open the history popup
	 */
	methods.handle = function(pageMenuButton, manager, undoer, openHistory) {
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
			
		var addBoardSection = $("<div>", { "class": "section" })
			.append(addBoardButton);
				
		var deleteAllBoards = $("<div>")
			.text(resources.clearAllBoards)
			.click(function () {
				if (confirm(resources.clearAllBoardsConfirm))
					manager.DeleteAll();
			});

		var deleteAllSection = $("<div>", { "class": "section" })
			.append(deleteAllBoards);
			
		var historyButton = $("<div>")
			.text(resources.historyPopupTitle)
			.click(openHistory);
		
		var historySection = $("<div>", { "class": "section" })
			.append(historyButton);
		
		var undoButton = $("<div>")
			.text(resources.undoLastChange)
			.click(undoer.undo);
			
		var redoButton = $("<div>")
			.text(resources.redoLastUndo)
			.click(undoer.redo);
		
		var useUndo = undoer.canUndo();
		var useRedo = undoer.canRedo();
		if (useRedo)
			historySection.prepend(redoButton);
		if (useUndo)
			historySection.prepend(undoButton);

		var menuOptions = (useUndo || useRedo)
			? addBoardSection.add(historySection)
			: addBoardButton.add(historyButton);
		
		if (manager.Any())
			menuOptions = menuOptions.add((useUndo || useRedo)
				? deleteAllSection
				: deleteAllBoards);
		

		_OptionMenu.create(menuOptions).addClass("main-page-menu fixed");
	};
		
    return methods;
});