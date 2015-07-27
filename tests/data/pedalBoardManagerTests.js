define([ "pedalBoardManager", "jquery", "helperMethods" ], function (pedalBoardManager, $, helpers) {	"use strict";	
    describe("data/pedalBoardManager.js", function () {
		var manager;
		var $fakeEl;
		
		/* Copied at random from pedalsGetter.js */
		var dummyPedal = {
			name: "ND-1 Nova Delay",
			id: 1,
			price: 16999,
			identifier: 2,
			type: 2,
		};				var dummyPedal2 = {			name: "Kindgom",			id: 2,			price: 16900,			identifier: 2,			type: 6,		};
		
		beforeEach(function () {			$fakeEl = $("<div>");
			manager = pedalBoardManager.create({ 				log: function () {},				changes: [],				batch: function (first, second, thrid, func) { 					/* Just call whichever is the function */					typeof second === "function"						? second() 						: func();				},				addCallback: function () {},			}, $fakeEl);
		});
		
		
		/* !Data Functions! */
		describe("GetBoard", function () {				
			it("should return a board with the given id", function () {
				/* setup */				var name = "Test";
				var domBoard = manager.Add(name, $fakeEl);
				var id = domBoard.id;

				/* test */
				var output = manager.GetBoard(id);
				expect(output.id).toEqual(id);				expect(output.data.Name).toEqual(name);
				expect(!helpers.isUndefined(output.clientRect)).toBe(true);
				expect(!helpers.isUndefined(output.clientRect.width)).toBe(true);
			});		

			it("should return undefined when the given id does not exist", function () {
				expect(helpers.isUndefined(manager.GetBoard("Fake-id from:" + new Date()))).toBe(true);		 
			});
		});
		
		describe("GetBoards", function () {
			it("sould return an array of all of the current boards", function () {
				/* setup */
				var first = manager.Add("first", $fakeEl).id;
				var second = manager.Add("second", $fakeEl).id;

				/* Call get boards and then select the dom elements from each so that we can easily compare them to our copy */
				var ids = helpers.select(manager.GetBoards(), 
				 function (board) {
					 return board.id;
				 });
				 
				expect(ids).toEqual([first, second]);
			});
		});
		
		describe("Any", function () {
			it("should return true if there are any boards", function () {
						manager.Add("board", $fakeEl);
					expect(manager.Any()).toBe(true);
				});				
		
			it("should return false if there are no boards", function () {
				expect(manager.Any()).toBe(false);
			});
			
			it("should return false if there are no boards that match the filter", function () {
				manager.Add("board", $fakeEl);
				
				expect(manager.Any(function (board) {
				   return board.data.Name === "Joe is the name of this one";
				})).toBe(false)
			});
			
			it("should return true if there are any boards that match the filter", function () {
				var boardName = "board";
				manager.Add(boardName, $fakeEl);
				
				expect(manager.Any(function (board) {
				   return board.data.Name === boardName;
				})).toBe(true)
			});
		});
		
		describe("Multiple", function () {
			it("should return true if there is more than one board", function () {
				manager.Add("board 1", $fakeEl);
				manager.Add("board 2", $fakeEl);
				expect(manager.Multiple()).toBe(true);
			});
		
			it("should return false if there is one of fewer boards", function () {
				manager.Add("board", $fakeEl);
				expect(manager.Multiple()).toBe(false);
			});
			
			it("should return false if there are one or fewer boards that match the filter", function () {
				manager.Add("board", $fakeEl);
				
				expect(manager.Multiple(function (board) {
				   return board.data.Name === "Joe is the name of this one";
				})).toBe(false)
			});
			
			it("should return true if there are one of more boards that match the filter", function () {
				var boardName = "board";
				manager.Add(boardName, $fakeEl);
				manager.Add(boardName, $fakeEl);
			
				expect(manager.Multiple(function (board) {
				   return board.data.Name === boardName;
				})).toBe(true)
			});
		});
		
		describe("AnyPedals", function () {
			it("should return true if there are any pedals on a given board", function () {
				var board = manager.Add("Test 1", $fakeEl);
				
				manager.AddPedal(dummyPedal, board.id);
						
				expect(manager.AnyPedals(board.id)).toBe(true);
			});

			it("should return false if there are no pedals on the given board", function () {
				var board = manager.Add("Test 1", $fakeEl);
				expect(manager.AnyPedals(board.id)).toBe(false);
			});
			
			it("should return false if the given board does not exists", function () {
				expect(manager.AnyPedals("This-is not a_real board.,.id: " + new Date())).toBe(false);
			});
		});
		
		describe("MultiplePedals", function () {
			it("should return true if there are any pedals on a given board", function () {
				var board = manager.Add("Test 1", $fakeEl);
				
				manager.AddPedal(dummyPedal, board.id);
				manager.AddPedal(dummyPedal, board.id);
						
				expect(manager.MultiplePedals(board.id)).toBe(true);
			});

			it("should return false if there are no pedals on the given board", function () {
				var board = manager.Add("Test 1", $fakeEl);
				expect(manager.MultiplePedals(board.id)).toBe(false);
			});
			
			it("should return false if there is one pedal on the given board", function () {
				var board = manager.Add("Test 1", $fakeEl);
				manager.AddPedal(dummyPedal, board.id);
				expect(manager.MultiplePedals(board.id)).toBe(false);
			});
			
			it("should return false if the given board does not exists", function () {
				expect(manager.MultiplePedals("This is_not a the id of a-real board. on" + new Date())).toBe(false);
			});
		});
		
		/* !Board Functions! */
		/*(name, contentConatiner) */
		describe("Add", function () {
			it("should create a dom element for the board and append it to the passed in param", function () {
				var board = manager.Add("Test 1");
				expect(board.el.get(0).parentNode).toBe($fakeEl.get(0));
			});
			
			it("should add the board to the board stack to be retrived with .GetBoard()", function () {
				var board = manager.Add("Stack me", $fakeEl);
				expect(manager.GetBoard(board.id).id).toBe(board.id);
			});
			
			it("should allow for boards with the same name", function () {
				var sharedName = "name";
				var b1 = manager.Add(sharedName, $fakeEl);
				var b2 = manager.Add(sharedName, $fakeEl);
				
				expect(b1).not.toEqual(b2);
				expect(b1.id).not.toEqual(b2.id);
				expect(manager.GetBoard(b1.id)).not.toEqual(manager.GetBoard(b2.id));
			});
		});
		
		describe("Rename", function () {	
			it("should change the name of data.Name property", function () {
				var board = manager.Add("test board", $fakeEl);

				var newName = "test new name";
				manager.Rename(newName, board.id);

				expect(manager.GetBoard(board.id).data.Name).toEqual(newName);
			});
				
			it("should throw if no board has that id", function () {
				var thrower = function () {
					manager.Rename("name", "clearly not _ a real id" + new Date());
				};
					
				expect(thrower).toThrow();
			});
		});
		
		describe("Delete", function () {
			it("should delete the board", function () {
				var board = manager.Add("test board", $fakeEl);
					
				var newName = "test new name";
				manager.Delete(board.id);
				
				expect(manager.GetBoard(board.id)).toBeUndefined();
			});
			
			it("should not delete any other boards", function () {
				var keepBoard   = manager.Add("test1", $fakeEl);
				var deleteBoard = manager.Add("test2", $fakeEl);
					
				manager.Delete(keepBoard.id);
				
				expect(manager.GetBoard(keepBoard.id)).toBeUndefined();
				expect(manager.GetBoard(deleteBoard.id)).not.toBeUndefined();
			});
			
			it("should throw if no board has that id", function () {
				var thrower = function () {
					manager.Delete("name", "clearly not _ a real id" + new Date());
				};
					
				expect(thrower).toThrow();
			});
		});
		
		describe("DeleteAll", function () {
			it("should delete all boards", function () {
				manager.Add("board", $fakeEl);
				manager.Add("another", $fakeEl);
				
				manager.DeleteAll();				
				expect(manager.GetBoards()).toEqual([]);
			});
		});
		
		/* Pedal Functions */
		describe("AddPedal", function () {
			/* (pedal, boardId, pedalContainer) */
			it("should add the pedal to the board with the given id", function () {
				var board = manager.Add("board", $fakeEl);
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				expect(manager.GetBoard(board.id).data.pedals).toContain(dummyPedal);
			});
			
			it("should ONLY add the pedal to the board with the given id, and no others", function () {
				var addBoard   = manager.Add("board", $fakeEl);
				var otherBoard = manager.Add("another", $fakeEl);

				manager.AddPedal(dummyPedal, addBoard.id, addBoard.el);
				
				expect(manager.GetBoard(addBoard.id).data.pedals).toContain(dummyPedal);
				expect(manager.GetBoard(otherBoard.id).data.pedals).not.toContain(dummyPedal);
			});
			
			it("should return a rendered pedal as a jquery object", function () {
				var board = manager.Add("board", $fakeEl);
				var pedal = manager.AddPedal(dummyPedal, board.id, board.el);

				expect(pedal instanceof $).toBe(true);
			});
			
			it("should append the rendered pedal to the passed in element", function () {
				var board = manager.Add("board", $fakeEl);
				var pedal = manager.AddPedal(dummyPedal, board.id);
				
				expect(pedal.get(0).parentNode.parentNode.parentNode).toBe(board.el.get(0));
			});
			
			it("should still render and return the pedal if no element is passed in to append it to", function () {
				var board = manager.Add("board", $fakeEl);
				var pedal = manager.AddPedal(dummyPedal, board.id);

				expect(pedal.get(0)).not.toBeUndefined();
			});
			
			it("should throw an exception if the given id is invalid", function () {
				var thrower = function () {
					manager.AddPedal(dummyPedal, "This is not even close to a real board_ id" + new Date());
				};
				expect(thrower).toThrow();
			});
			
			it("should allow for pedals with the same id", function () {
				var board = manager.Add("board", $fakeEl);
				
				manager.AddPedal(dummyPedal, board.id, board.el);
				manager.AddPedal(dummyPedal, board.id, board.el);

				var dummyPedalsOnBoard = helpers.where(manager.GetBoard(board.id).data.pedals, function(pedal) {
					return pedal.id === dummyPedal.id;
				});
				
				expect(dummyPedalsOnBoard.length).toEqual(2);
			});
		});
		
		describe("RemovePedal", function () {
			it("should remove the pedal", function () {
						var board = manager.Add("board", $fakeEl);
						manager.AddPedal(dummyPedal, board.id, board.el);
						manager.RemovePedal(0, board.id);
						
						expect(manager.GetBoard(board.id).data.pedals).not.toContain(dummyPedal);
				});
				
				it("should only remove one instance of a pedal", function () {
					  var board = manager.Add("board", $fakeEl);
					
						manager.AddPedal(dummyPedal, board.id, board.el);
						manager.AddPedal(dummyPedal, board.id, board.el);

						manager.RemovePedal(dummyPedal.id, board.id);

						var dummyPedalsOnBoard = helpers.where(manager.GetBoard(board.id).data.pedals, function(pedal) {
							 return pedal.id === dummyPedal.id;
						});
						
						expect(dummyPedalsOnBoard.length).toEqual(1);
				});
		
			it("should throw an exception if the given pedal id does not match any on the board", function () {
					var board = manager.Add("board", $fakeEl);
														
						var thrower = function () {
							manager.RemovePedal(dummyPedal.id, board.id);
						};
						expect(thrower).toThrow();
				});
		
			it("should throw an exception if the given board id does not exist", function () {
						var thrower = function () {
							manager.RemovePedal(dummyPedal.id, "This is not even close to a real board_ id" + new Date());
						};
						expect(thrower).toThrow();
				});
		});
		
		describe("Clear", function () {
			it("should clear all of the pedals on the pedalboard", function () {
					var board = manager.Add("board", $fakeEl);
					
						manager.AddPedal(dummyPedal, board.id, board.el);
						manager.AddPedal(dummyPedal, board.id, board.el);
						
						manager.Clear(board.id);
						
						expect(manager.GetBoard(board.id).data.pedals).toEqual([]);
				});
				
				it("should throw an exception when no boards with that id exist", function () {
					  var thrower = function () {
							manager.Clear("Clearly not a_ board-id. " + new Date());
						};
						expect(thrower).toThrow();
				});
		});
		
		describe("AddChangeCallback", function () {
			it ("should not call callbacks as a part of adding callbacks", function () {
				var board = manager.Add("test", $fakeEl);
				
				var hit = false;
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				
				expect(hit).toBe(false);
			});
			
			it("should add a callback to be called on pedal add", function () {
				var board = manager.Add("test", $fakeEl);
				
				var hit = false;
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				expect(hit).toBe(true);
			});
			
			it("should add a callback to be called on pedal remove", function () {
				var board = manager.Add("test", $fakeEl);					
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				var hit = false;
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				
				manager.RemovePedal(0, board.id);
				
				expect(hit).toBe(true);
			});
			
			it("should not call callbacks on board delete", function () {
				var board = manager.Add("test", $fakeEl);					
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				var hit = false;
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				
				manager.Delete(board.id);
				
				expect(hit).toBe(false);
			});
			
			it("should add a callback to be called on board clear", function () {
				var board = manager.Add("test", $fakeEl);					
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				var hit = false;
				manager.AddChangeCallback(board.id, function () {
					hit = true;
				});
				
				manager.Clear(board.id);
				
				expect(hit).toBe(true);
			});
			
			it("should add a throw an error if the callback is undefined", function () {
				var board = manager.Add("test", $fakeEl);					
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				var hit = false;
				var thrower = function () {
					manager.AddChangeCallback(board.id);
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError();
			});
			
			it("should add a throw an error if the callback is otherwise not a function", function () {
				var board = manager.Add("test", $fakeEl);					
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				var hit = false;
				var thrower = function () {
					manager.AddChangeCallback(board.id, [1, 2, 3]);
				};
				
				expect(thrower).toThrow();
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should be able to handle multiple callbacks", function () {
				var board = manager.Add("test", $fakeEl);
				
				var hit1 = false;
				manager.AddChangeCallback(board.id, function () {
					hit1 = true;
				});
				
				var hit2 = false;
				manager.AddChangeCallback(board.id, function () {
					hit2 = true;
				});
				
				expect(hit1).toBe(false);
				expect(hit2).toBe(false);
				
				manager.AddPedal(dummyPedal, board.id, board.el);
										
				expect(hit1).toBe(true);
				expect(hit2).toBe(true);
			});
			
			it("should not call another boards callbacks", function () {
				var board1 = manager.Add("test", $fakeEl);
				var board2 = manager.Add("test", $fakeEl);
				
				var hit1 = false;
				manager.AddChangeCallback(board1.id, function () {
					hit1 = true;
				});
				
				var hit2 = false;
				manager.AddChangeCallback(board2.id, function () {
					hit2 = true;
				});
				
				manager.AddPedal(dummyPedal, board1.id, board1.el);
										
				expect(hit1).toBe(true);
				expect(hit2).toBe(false);
			});
			
			it("should add a callback to be called by all board changes if only a function is passed in", function () {
				var board1 = manager.Add("test", $fakeEl);
				var board2 = manager.Add("test", $fakeEl);
				
				var hitOnce = false;
				var hitTwice = false;
				var hitAboveTwo = false;
				manager.AddChangeCallback(function () {
					if (!hitOnce)
						hitOnce = true;
					else if (!hitTwice)
						hitTwice = true;
					else
						hitAboveTwo = true;
				});
				
				manager.AddPedal(dummyPedal, board1.id, board1.el);
				manager.AddPedal(dummyPedal, board2.id, board2.el);

				expect(hitOnce).toBe(true);
				expect(hitTwice).toBe(true);
				expect(hitAboveTwo).toBe(false);
			});
			
			it("should allow for multiple global change callbacks", function () {
				var board = manager.Add("test", $fakeEl);
				
				var hit1 = false;
				manager.AddChangeCallback(function () {
					hit1 = true;
				});
				
				var hit2 = false;
				manager.AddChangeCallback(function () {
					hit2 = true;
				});
				
				manager.AddPedal(dummyPedal, board.id, board.el);
										
				expect(hit1).toBe(true);
				expect(hit2).toBe(true);
			});
			
			it("should allow for global callbacks and single board change callbacks simultaneously", function () {
				var board = manager.Add("test", $fakeEl);
				
				var hit1 = false;
				manager.AddChangeCallback(function () {
					hit1 = true;
				});
				
				var hit2 = false;
				manager.AddChangeCallback(board.id, function () {
					hit2 = true;
				});
				
				manager.AddPedal(dummyPedal, board.id, board.el);
				
				expect(hit1).toBe(true);
				expect(hit2).toBe(true);
			});
		});
		
		describe("Move", function () {
			it("should throw an exception if an invalid board id is provided", function () {
				var thrower = function () {
					manager.Move("not a reaL_board-iD" + new Date(), {});
				};
				
				expect(thrower).toThrow();
			});
			
			it("should throw a TypeError if @clientRect is not a ClientRect object", function () {
				var board = manager.Add("Board Name", $fakeEl);
				
				var thrower = function () {
					manager.Move(board.id, {});
				};
				
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should set the clientRect property of the board", function () {
				var board = manager.Add("Board Name", $fakeEl);
				
				var rect = board.el.get(0).getBoundingClientRect();
				
				manager.Move(board.id, rect);
				
				var savedRect = manager.GetBoard(board.id).clientRect;
				
				expect(savedRect.left).toEqual(rect.left);
				expect(savedRect.top).toEqual(rect.top);
				expect(savedRect.width).toEqual(rect.width);					
			});
		});
		
		describe("Resize", function () {					
			it("should set the clientRect property of the board", function () {
				var board = manager.Add("Board Name", $fakeEl);
				
				var rect = board.el.get(0).getBoundingClientRect();
				
				manager.Resize(board.id, rect);
				var savedRect = manager.GetBoard(board.id).clientRect;
				
				expect(savedRect.left).toEqual(rect.left);
				expect(savedRect.top).toEqual(rect.top);
				expect(savedRect.width).toEqual(rect.width);
			});
			
			it("should throw a TypeError if @clientRect is not a ClientRect object", function () {
				var board = manager.Add("Board Name", $fakeEl);
				
				var thrower = function () {
					manager.Resize(board.id, {});
				};
				
				expect(thrower).toThrowError(TypeError);
			});
			
			it("should throw an exception if an invalid board id is provided", function () {
				var thrower = function () {
					manager.Resize("not a reaL_board-iD" + new Date(), {});
				};
				
				expect(thrower).toThrow();
			});
		});				describe("Reorder Pedal", function () {			it("should place the pedal at the given old index to the given new index", function () {				var board = manager.Add("Board Name", $fakeEl);								manager.AddPedal(dummyPedal,  board.id);				manager.AddPedal(dummyPedal2, board.id);								var pedalsBefore = manager.GetBoard(board.id).data.pedals;								expect(pedalsBefore[0]).toEqual(dummyPedal);				expect(pedalsBefore[1]).toEqual(dummyPedal2);								manager.ReorderPedal(0, 1, board.id);								var pedalsAfter = manager.GetBoard(board.id).data.pedals;								expect(pedalsAfter[0]).toEqual(dummyPedal2);				expect(pedalsAfter[1]).toEqual(dummyPedal);			});						it("should throw a Error if @oldPedalIndex is invalid", function () {				var board = manager.Add("Board Name", $fakeEl);				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower = function () {					manager.ReorderPedal(9, 1, board.id);				};				expect(thrower).toThrowError();			});						it("should throw a Error if @newPedalIndex is invalid", function () {				var board = manager.Add("Board Name", $fakeEl);				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower = function () {					manager.ReorderPedal(1, 9, board.id);				};				expect(thrower).toThrowError();			});						it("should throw a Error if @oldPedalIndex and @newPedalIndex are invalid", function () {				var board = manager.Add("Board Name", $fakeEl);								var thrower = function () {					manager.ReorderPedal(0, 1, board.id);				};				expect(thrower).toThrowError();			});											it("should throw a Error if @oldPedalIndex is negative", function () {				var board = manager.Add("Board Name", $fakeEl);				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower = function () {					manager.ReorderPedal(-1, 1, board.id);				};				expect(thrower).toThrowError();			});						it("should throw a Error if @newPedalIndex is negative", function () {				var board = manager.Add("Board Name", $fakeEl);				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower = function () {					manager.ReorderPedal(1, -1, board.id);				};				expect(thrower).toThrowError();			});						it("should throw a Error if @oldPedalIndex and @newPedalIndex are negative", function () {				var board = manager.Add("Board Name", $fakeEl);				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower = function () {					manager.ReorderPedal(-1, -1, board.id);				};				expect(thrower).toThrowError();			});						it("should throw an exception if an invalid board id is provided", function () {				var thrower = function () {					manager.Resize(0, 0, "not a reaL_board-iD" + new Date());				};								expect(thrower).toThrow();			});		});				describe("Import", function () {			it("should add a copy of pedalboards given", function () {				var added = manager.Add("Test");				expect(manager.GetBoards().length).toEqual(1);								manager.Import(manager.GetBoard(added.id));				expect(manager.GetBoards().length).toEqual(2);				});						it("should not be able to import the value returned from manager.Add()", function () {				var added = manager.Add("Test");				expect(manager.GetBoards().length).toEqual(1);								expect(function () {					manager.Import(added);				}).toThrowError(TypeError);			});						it("should not continue to keep copied boards up to date!", function () {				var added = manager.Add("Test");				expect(manager.GetBoards().length).toEqual(1);								manager.Import(manager.GetBoard(added.id));				expect(manager.GetBoards().length).toEqual(2);				expect(manager.GetBoard(added.id).data.pedals.length).toEqual(0);				expect(manager.GetBoards()[1].data.pedals.length).toEqual(0);				manager.AddPedal(dummyPedal, added.id);				expect(manager.GetBoard(added.id).data.pedals.length).toEqual(1);				expect(manager.GetBoards()[1].data.pedals.length).toEqual(0);			});						it("should import an array of boards", function () {				manager.Add("Test");				expect(manager.GetBoards().length).toEqual(1);								manager.Add("Test 2");				expect(manager.GetBoards().length).toEqual(2);								manager.Import(manager.GetBoards());				expect(manager.GetBoards().length).toEqual(4);			});						it("should throw no error for undefined for @boards", function () {				var thrower = function () {					manager.Import(void(0));				};				expect(thrower).not.toThrow();			});						it("should throw no error for nothing for @boards", function () {				var thrower = function () {					manager.Import();				};				expect(thrower).not.toThrow();			});						it("should throw no error for an empty array for @boards", function () {				var thrower = function () {					manager.Import([]);				};				expect(thrower).not.toThrow();			});						it("should throw an error if any of the objects in the @boards array are invalid", function () {				var thrower = function () {					manager.Import(["not a board"]);				};				expect(thrower).toThrowError();								var board = manager.Add("Board Name");				manager.AddPedal(dummyPedal, board.id);				manager.AddPedal(dummyPedal2, board.id);								var thrower2 = function () {					manager.Import([board, "not a board"]);				};				expect(thrower2).toThrowError();			});		});
	});
})