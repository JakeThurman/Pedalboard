define([ "helperMethods", "StateReverter", "PedalBoardManager", "changeLogger", "jquery" ],
function (helpers, reverter, pedalBoardManager, changeLogger, $) {
	"use strict";
	
	var reverterFull;
	var reverterEmpty;
	
	describe("data/stateReverter.js", function () {		
		/* Copied at random from pedalsGetter.js */
		var dummyPedal = {
			name: "ND-1 Nova Delay",
			id: 1,
			price: 16999,
			identifier: 2,
			type: 2,
		};
		
		var dummyPedal2 = {
			name: "Kindgom",
			id: 2,
			price: 16900,
			identifier: 2,
			type: 6,
		};
		
		var rect1 = {
			left: 10,
			top: 10,
			width: 100,
		};
		var rect2 = {
			left: 100,
			top: 100,
			width: 500,
		};
		
		var loggerFull;
		var loggerEmpty;
		var managerFull;
		var managerEmpty;
		
		var doBasicLoad = function (a, b, c) {
			/*Rename*/
				managerFull.Rename(managerFull.GetBoard(a.id).data.Name + "-CHANGED", a.id);
				managerFull.Rename(managerFull.GetBoard(a.id).data.Name + "-CHANGED", a.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "-CHANGED", b.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "-CHANGED", b.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "-CHANGED", b.id);
				managerFull.Rename(managerFull.GetBoard(c.id).data.Name + "-CHANGED", c.id);
		
			/* Fill Boards  */
				/*A*/
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal2, a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal2, a.id);
				managerFull.AddPedal(dummyPedal2, a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				
				/*B*/
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				
				/*C*/
				managerFull.AddPedal(dummyPedal,  c.id);
				managerFull.AddPedal(dummyPedal,  c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal,  c.id);
				managerFull.AddPedal(dummyPedal,  c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal,  c.id);
			
			/*Remove pedals*/
				/*B*/
				managerFull.RemovePedal(0, b.id);
				managerFull.RemovePedal(0, b.id);
				managerFull.RemovePedal(4, b.id);
				
				/*C*/
				managerFull.RemovePedal(4, c.id);
				managerFull.RemovePedal(4, c.id);
				managerFull.RemovePedal(2, c.id);
				managerFull.RemovePedal(0, c.id);
				managerFull.RemovePedal(0, c.id);
				managerFull.RemovePedal(0, c.id);
				
			/*Add more pedals*/
				/*A*/
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal2, a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				
				/*B*/
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal2, b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				
				/*C*/
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
			/*Clear C*/
				managerFull.Clear(c.id);
			
			/* Reorder pedals on a and b */
				managerFull.ReorderPedal(0, 2, a.id);
				managerFull.ReorderPedal(1, 0, a.id);
				managerFull.ReorderPedal(2, 5, b.id);
				managerFull.ReorderPedal(3, 2, b.id);
				managerFull.ReorderPedal(0, 2, b.id);
				managerFull.ReorderPedal(5, 2, a.id);
				managerFull.ReorderPedal(4, 2, a.id);
				managerFull.ReorderPedal(0, 1, b.id);
				managerFull.ReorderPedal(4, 2, b.id);
				managerFull.ReorderPedal(1, 0, a.id);
			
			/*Rename*/
				managerFull.Rename(managerFull.GetBoard(a.id).data.Name + " Rename", a.id);
				managerFull.Rename(managerFull.GetBoard(a.id).data.Name + " renmae", a.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "-renmae", b.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "_renmae", b.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "+renmae", b.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "=rename", b.id);
				managerFull.Rename(managerFull.GetBoard(c.id).data.Name + "/rename", c.id);
				
			/*Delete A*/
				managerFull.Delete(a.id);
			
			/*Add pedals to b and c*/
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				managerFull.AddPedal(dummyPedal2, c.id);
				managerFull.AddPedal(dummyPedal,  b.id);
				
			/* Reorder pedals on b and c */
				managerFull.ReorderPedal(0, 1, b.id);
				managerFull.ReorderPedal(2, 0, c.id);
				managerFull.ReorderPedal(1, 0, c.id);
				managerFull.ReorderPedal(3, 5, b.id);
				managerFull.ReorderPedal(1, 0, c.id);
				managerFull.ReorderPedal(0, 2, b.id);
				managerFull.ReorderPedal(4, 2, b.id);
				managerFull.ReorderPedal(1, 0, c.id);
				managerFull.ReorderPedal(0, 2, b.id);
				managerFull.ReorderPedal(4, 2, b.id);
		};
		
		var doMoveResize = function(boards) {
			var manager = managerFull;
			helpers.forEach(boards, function (board) {
				manager.Move(board.id, rect1);
				manager.Move(board.id, rect2);
				manager.Move(board.id, rect2);
				manager.Move(board.id, rect2);
				manager.Resize(board.id, rect1);
				manager.Resize(board.id, rect1);
				manager.Resize(board.id, rect1);
				manager.Resize(board.id, rect2);
				manager.Resize(board.id, rect2);
				manager.Move(board.id, rect1);
				manager.Move(board.id, rect1);
				manager.Move(board.id, rect1);
				manager.Move(board.id, rect1);
				manager.Resize(board.id, rect1);
				manager.Move(board.id, rect2);
				manager.Resize(board.id, rect1);
				manager.Move(board.id, rect2);
				manager.Resize(board.id, rect1);
				manager.Resize(board.id, rect1);
				manager.Move(board.id, rect2);
				manager.Resize(board.id, rect2);
				manager.Resize(board.id, rect2);
			});
		};
		
		beforeEach(function () {		
			/* Create managers */
			loggerFull = changeLogger.create();
			var parentFull =  $("<div>");
			managerFull = new pedalBoardManager(loggerFull, parentFull);
			
			loggerEmpty = changeLogger.create();
			var parentEmpty = $("<div>");
			managerEmpty = new pedalBoardManager(loggerEmpty, parentEmpty);
			
			/* ! Load ManagerFull ! */
			/* Add boards */
			var a = managerFull.Add("board a");
			var b = managerFull.Add("board b");
			var c = managerFull.Add("board c");
						
			/* Load a basic set of data */
			doBasicLoad(a, b, c);
			
			/* Add move and resize events to b twice as much as c, and a none at all */
				doMoveResize([b, c, b]);
				
			/*Delte all*/
			managerFull.DeleteAll();
			
			/* recreate all of the boards since the old were deleted */
			a = managerFull.Add("board a - 2");
			b = managerFull.Add("board b - 2");
			c = managerFull.Add("board c - 2");
			
			/* Load a basic set of data - again*/
			doBasicLoad(a, b, c);
			
			/* Readd another "a" board since @doBasicLoad deletes it */
			a = managerFull.Add("board a - 3");
			
			/* Load a basic set of data - one more time!*/
			doBasicLoad(a, b, c);
			
			/* Readd another "a" board since @doBasicLoad deletes it - again */
			a = managerFull.Add("board a - 3");
			
			/*Add some pedals to a*/
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal2, a.id);
				managerFull.ReorderPedal(0, 1, a.id); /* Throw a reorder in there for good measure */
				managerFull.AddPedal(dummyPedal,  a.id);
				managerFull.AddPedal(dummyPedal,  a.id);
				
			/* Add move and resize events to b twice as much as c, and a none at all */
				doMoveResize([b, b, c]);
				
			/*Rename a and b*/
				managerFull.Rename(managerFull.GetBoard(a.id).data.Name + " Rename", a.id);
				managerFull.Rename(managerFull.GetBoard(b.id).data.Name + "+rename", b.id);
				
			reverterFull = new reverter(managerFull, loggerFull);
			reverterEmpty = new reverter(managerEmpty, loggerEmpty);
		});

		function pluck(collection, name) {
			return helpers.select(collection, function (obj) {
				return obj[name];
			});
		}
		
		describe("replay", function () {		
			it("should replay a set of changes", function () {
				reverterEmpty.replay(loggerFull.changes);
				
				var emptyBoards = managerEmpty.GetBoards();
				var fullBoards  = managerFull.GetBoards();
				
				expect(emptyBoards.length).toEqual(fullBoards.length);
				
				var fullData  = pluck(fullBoards,  "data");
				var emptyData = pluck(emptyBoards, "data");
				
				expect(JSON.stringify(pluck(fullData, "Name")))
			  .toEqual(JSON.stringify(pluck(emptyData, "Name")));
			  
				var fullPedals  = pluck(fullData, "pedals");
				var emptyPedals = pluck(emptyData, "pedals");
				
				expect(JSON.stringify(pluck(fullPedals,  "name")))
			  .toEqual(JSON.stringify(pluck(emptyPedals, "name")));
			  
				expect(JSON.stringify(pluck(fullPedals,  "id")))
			  .toEqual(JSON.stringify(pluck(emptyPedals, "id")));
			  
				expect(JSON.stringify(pluck(fullPedals,  "color")))
			  .toEqual(JSON.stringify(pluck(emptyPedals, "color")));
			  
				expect(JSON.stringify(pluck(fullPedals,  "fullName")))
			  .toEqual(JSON.stringify(pluck(emptyPedals, "fullName")));
			});
			
			it("should not throw", function () {
				var nonThrower = function () {
					reverterEmpty.replay(loggerFull.changes);
				};
				expect(nonThrower).not.toThrow();
			});
		});
		
		describe("revert", function () {
			it("should revert a set of changes", function () {
				var loggerLengthBefore = loggerFull.changes.length;
				reverterFull.revert(helpers.reverse(loggerFull.changes));
				expect(managerFull.GetBoards().length).toEqual(0);
				expect(loggerFull.changes.length).toBeGreaterThan(loggerLengthBefore * 2); /* all were reverted, so there should be a change for each plus a change for the revert change */
			});
			
			it("should not throw", function () {
				var nonThrower = function () {
					reverterFull.revert(helpers.reverse(loggerFull.changes));
				};
				expect(nonThrower).not.toThrow();
			});
		});
		
		describe("revert and replay", function () {
			it("should work together without error", function () {
				var nonThrower = function () {
					reverterEmpty.replay(loggerFull.changes);
					reverterEmpty.revert(helpers.reverse(loggerEmpty.changes));
				};
				expect(nonThrower).not.toThrow();
			});
			
			it("should be able to work together even with outside changes in between each", function () {
				var nonThrower = function () {
					reverterEmpty.replay(loggerFull.changes);
					
					var a = managerEmpty.Add("test");
					managerEmpty.AddPedal(dummyPedal, a.id);
					
					reverterEmpty.revert(helpers.reverse(loggerEmpty.changes));
				};
				expect(nonThrower).not.toThrow();
			});
		});
	});
});