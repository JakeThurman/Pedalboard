define([ "pedalBoardManager", "jquery", "helperMethods", "pedalBoardClasses" ], function (pedalBoardManager, $, helpers, classes) {
    describe("data/pedalBoardManager.js", function () {
		    var manager;
				var $fakeEl;
				
				/* Copied at random from pedalsGetter.js */
				var dummyPedal = new classes.Pedal({
				    name: "ND-1 Nova Delay",
						id: 2,
        				price: 169.99,
        				identifier: 2,
        				type: 2,
				});
				
				beforeEach(function () {
				    manager = pedalBoardManager.create();
						$fakeEl = $("<div>");
				});
				
				
				/* !Data Functions! */
				describe("GetBoard", function () {				
				    it("should return a board with the given id", function () {
						   /* setup */
							 var domBoard = manager.Add("Test", $fakeEl);
							 var id = domBoard.options.id;
							 
							 /* test */
							 var output = manager.GetBoard(id);
							 expect(output.dom).toBe(domBoard);
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
							 var first = manager.Add("first", $fakeEl);
							 var second = manager.Add("second", $fakeEl);
							 
							 /* Call get boards and then select the dom elements from each so that we can easily compare them to our copy */
							 var doms = helpers.select(manager.GetBoards(), 
    							 function (board) {
    							     return board.dom;
    							 });
							 
					     expect(doms).toEqual([first, second]);
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
								var id = board.options.id
								
								/* Random pedal data copied from pedalsGetter.js */
								manager.AddPedal(dummyPedal, id);
										
								expect(manager.AnyPedals(id)).toBe(true);
						});
				
						it("should return false if there are no pedals on the given board", function () {
						    var board = manager.Add("Test 1", $fakeEl);
								var id = board.options.id
										
								expect(manager.AnyPedals(id)).toBe(false);
						});
						
						it("should return false if the given board does not exists", function () {
								expect(manager.AnyPedals("This-is not a_real board.,.id: " + new Date())).toBe(false);
						});
				});
				
				/* !Board Functions! */
				/*(name, contentConatiner) */
				describe("Add", function () {
				    it("should create a dom element for the board and append it to the passed in param", function () {
								var temp = $("<div>");
								var board = manager.Add("Test 1", temp);
    						expect(board.el.get(0).parentNode).toBe(temp.get(0));
						});
						
						it("should add the board to the board stack to be retrived with .GetBoard()", function () {
						    var board = manager.Add("Stack me", $fakeEl);
								expect(manager.GetBoard(board.options.id).dom).toBe(board);
						});
						
						it("should allow for boards with the same name", function () {
						    var sharedName = "name";
						    var b1 = manager.Add(sharedName, $fakeEl);
								var b2 = manager.Add(sharedName, $fakeEl);
								
								expect(b1).not.toEqual(b2);
								expect(b1.options.id).not.toEqual(b2.options.id);
								expect(manager.GetBoard(b1.options.id)).not.toEqual(manager.GetBoard(b2.options.id));
						});
				});
				
				describe("Rename", function () {	
				    it("should change the name of data.Name property", function () {
						    var board = manager.Add("test board", $fakeEl);
								
								var newName = "test new name";
								manager.Rename(newName, board.options.id);
								
								expect(manager.GetBoard(board.options.id).data.Name).toEqual(newName);
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
								manager.Delete(board.options.id);
								
								expect(manager.GetBoard(board.options.id)).toBeUndefined();
						});
						
						it("should not delete any other boards", function () {
								var keepBoard   = manager.Add("test1", $fakeEl);
						    var deleteBoard = manager.Add("test2", $fakeEl);
								
								manager.Delete(keepBoard.options.id);
								
								expect(manager.GetBoard(keepBoard.options.id)).toBeUndefined();
								expect(manager.GetBoard(deleteBoard.options.id)).not.toBeUndefined();
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
						    manager.AddPedal(dummyPedal, board.options.id, board.el);
								
								expect(manager.GetBoard(board.options.id).data.pedals).toContain(dummyPedal);
						});
						
						it("should ONLY add the pedal to the board with the given id, and no others", function () {
						    var addBoard   = manager.Add("board", $fakeEl);
						    var otherBoard = manager.Add("another", $fakeEl);

								manager.AddPedal(dummyPedal, addBoard.options.id, addBoard.el);
								
								expect(manager.GetBoard(addBoard.options.id).data.pedals).toContain(dummyPedal);
								expect(manager.GetBoard(otherBoard.options.id).data.pedals).not.toContain(dummyPedal);
						});
						
						it("should return a rendered pedal as a jquery object", function () {
						    var board = manager.Add("board", $fakeEl);
							  var pedal = manager.AddPedal(dummyPedal, board.options.id, board.el);
								
								expect(pedal instanceof $).toBe(true);
						});
						
						it("should append the rendered pedal to the passed in element", function () {
						    var board = manager.Add("board", $fakeEl);
							  var pedal = manager.AddPedal(dummyPedal, board.options.id, board.el);
								
								expect(pedal.get(0).parentNode).toBe(board.el.get(0));
						});
						
						it("should still render and return the pedal if no element is passed in to append it to", function () {
						    var board = manager.Add("board", $fakeEl);
							  var pedal = manager.AddPedal(dummyPedal, board.options.id);

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
						    
								manager.AddPedal(dummyPedal, board.options.id, board.el);
								manager.AddPedal(dummyPedal, board.options.id, board.el);

								var dummyPedalsOnBoard = helpers.where(manager.GetBoard(board.options.id).data.pedals, function(pedal) {
								     return pedal.id === dummyPedal.id;
								});
								
								expect(dummyPedalsOnBoard.length).toEqual(2);
						});
				});
				
				describe("RemovePedal", function () {
				    it("should remove the pedal", function () {
								var board = manager.Add("board", $fakeEl);
								manager.AddPedal(dummyPedal, board.options.id, board.el);
								manager.RemovePedal(dummyPedal.id, board.options.id);
								
								expect(manager.GetBoard(board.options.id).data.pedals).not.toContain(dummyPedal);
						});
						
						it("should only remove one instance of a pedal", function () {
							  var board = manager.Add("board", $fakeEl);
						    
								manager.AddPedal(dummyPedal, board.options.id, board.el);
								manager.AddPedal(dummyPedal, board.options.id, board.el);

								manager.RemovePedal(dummyPedal.id, board.options.id);

								var dummyPedalsOnBoard = helpers.where(manager.GetBoard(board.options.id).data.pedals, function(pedal) {
								     return pedal.id === dummyPedal.id;
								});
								
								expect(dummyPedalsOnBoard.length).toEqual(1);
						});
				
				    it("should throw an exception if the given pedal id does not match any on the board", function () {
						    var board = manager.Add("board", $fakeEl);
																
								var thrower = function () {
								    manager.RemovePedal(dummyPedal.id, board.options.id);
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
				
				});
		});
})