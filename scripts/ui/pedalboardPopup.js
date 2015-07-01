define(["_Popup", "jquery", "textResources", "pedalRenderer", "pedalboardPopupOptionsHandler", "reporter", "jquery-ui"], function (_Popup, $, resources, pedalRenderer, pedalboardPopupOptionsHandler, reporter) {
	var methods = {};
	
	/*Make sure the window nextNewPedalBoardIdoardId value is setup*/
	if (window && !window.nextNewPedalBoardId)
		window.nextNewPedalBoardId = 1;
	
	/*Params:
	 *  @title:    the inital title for the pedal board
	 *  @appendTo: the main dom object to append and limit this board to.
	 *  @manager:  the pedalBoardManager.js instance that created this
	 */
	methods.create =  function (title, appendTo, manager) {		
		var content = $("<div>", { "class": "pedal-board display-none" });
		
		var helpText = $("<div>", { "class": "help-text display-none" })
			.text(resources.pedalBoardDragHelpText);
		
		var menuButton = $("<i>", { "class": "fa fa-bars" });
					 
		var popup = _Popup.create(content.add(helpText), {
			renameable: true,
			rename: function (name, boardId) { manager.Rename(name, boardId); },
			id: "pedal-board-" + window.nextNewPedalBoardId++,
			title: title,
			header: menuButton,
			init: init
		});
		
		popup.el.draggable({ 
				handle: ".header",
				stop: function () {
					manager.Move(popup.id, popup.el.get(0).getBoundingClientRect());
				}
			})
			.resizable({ 
				handles: 'e, w',
				minHeight: 150,
				minWidth: 200,
				maxHeight: 900,
				maxWidth: 900,
				stop: function () {
					manager.Resize(popup.id, popup.el.get(0).getBoundingClientRect());
				}
			});
		
		var deleteAction  = function( event, ui ) {
			var pedalId = pedalRenderer.getId(ui.draggable);
			ui.draggable.remove();
			manager.RemovePedal(pedalId, popup.id);
		};

		var trashCan = $("<i>", { "class": "fa fa-trash" });

		/* Make the pedals sortable */
		content.sortable({
			containment: popup.el,
			items: ".single-pedal-data:not(.non-sortable)",
			axis: "y",
			start: function (e, ui) {
				trashCan.appendTo(content)
					.droppable({
						hoverClass: "trash-hover",
						drop: deleteAction
					});
			},
			stop: function (e, ui) {
				trashCan.remove();
			},
			placeholder: "pedal-placeholder single-pedal-data",
		});
		
		menuButton.click(function () {			 
			pedalboardPopupOptionsHandler.handle(popup.id, menuButton, content, manager, 
				function (reportType) { /* startReport */
					reporter.report(manager.GetBoard(popup.id).data, reportType);
				}, function (compareBoardId, compareType) { /* startCompare */
					reporter.compare(manager.GetBoard(popup.id).data, manager.GetBoard(compareBoardId).data, compareType);
				});
		});
		
		function init(popup) {
			popup.el.appendTo(appendTo)
				.css("position","absolute");
		}
		
		/* add help text */
		var addFirstPedalHelp = $("<div>", { "class": "no-pedals-help-text non-sortable" })
			.text(resources.pedalboardNoPedalsHelpText)
			.insertBefore(content)
			.click(function () {
				menuButton.click();
			});
		
		$("<i>", { "class": "fa fa-level-up float-right" })
			.appendTo(addFirstPedalHelp);
		
		/* add a change callback to decide if the help text should be hidden */
		manager.AddChangeCallback(popup.id, function () {
			if (manager.AnyPedals(popup.id)) {
				helpText.add(content)
					.removeClass("display-none");
				
				addFirstPedalHelp.remove();
			}
			else {
				helpText.add(content)
					.addClass("display-none");
				
				addFirstPedalHelp.insertBefore(content)
					.click(function () {
						menuButton.click();
					});
			}
		});
		
		/* return the popup */
		return popup;
	};
		
	return methods;
});
