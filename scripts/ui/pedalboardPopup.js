define(["_Popup", "jquery", "textResources", "pedalRenderer", "pedalboardPopupOptionsHandler", "reporter", "addPedalMenu", "jquery-ui"], function (_Popup, $, resources, pedalRenderer, pedalboardPopupOptionsHandler, reporter, addPedalMenu) {
	"use strict";
	
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
			
		function startAddingPedals() {
			return addPedalMenu.create(menuButton, function (pedal) {
				manager.AddPedal(pedal, popup.id, content);
			});
		}
		
		var helpText = $("<div>", { "class": "help-text display-none" })
			.text(resources.pedalBoardDragHelpText);
			
		var addPedalsQuickIcon = $("<i>", { "class": "fa fa-plus float-left" })
			.prependTo(helpText)
			.click(function () {
				startAddingPedals()
					.addClass("quick-add-pedals-menu");
			});
		
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
		var justDeleted = false;
		
		var deleteAction  = function( event, ui ) {
			var pedalId = pedalRenderer.getId(ui.draggable);
			ui.draggable.remove();
			manager.RemovePedal(pedalId, popup.id);
			justDeleted = true;
		};

		var trashCan = $("<i>", { "class": "fa fa-trash" });
		
		/* Used to make the  */
		var originalIndex;
		/* Make the pedals sortable */
		content.sortable({
			containment: popup.el,
			items: ".single-pedal-data:not(.non-sortable)",
			axis: "y",
			start: function (e, ui) {
				/* add the delete pedal zone */
				trashCan.appendTo(content)
					.droppable({
						hoverClass: "trash-hover",
						drop: deleteAction
					});
					
				/* the index before start is equal to the number of pedals previous to this */
				originalIndex = ui.item.prevAll().length;
			},
			stop: function (e, ui) {
				/* remove the delete pedal zone */
				trashCan.remove();
				
				/* If the pedal was just deleted, don't try to reorder - IT'S GONE! */
				if (justDeleted) {
					justDeleted = false;
					return;
				}
				/* the new index is equal to the number of pedals previous to this */
				manager.ReorderPedal(originalIndex, ui.item.prevAll().length, popup.id);
			},
			placeholder: "pedal-placeholder single-pedal-data",
		});
		
		menuButton.click(function () {			 
			pedalboardPopupOptionsHandler.handle(popup.id, menuButton, manager, 
				startAddingPedals, /* @addPedals */
				function (reportType) { /* @startReport */
					reporter.report(manager.GetBoard(popup.id).data, reportType);
				}, function (compareBoardId, compareType) { /* @startCompare */
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
			.click(startAddingPedals);
		
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
					.click(startAddingPedals);
			}
		});
		
		/* return the popup */
		return popup;
	};
		
	return methods;
});
