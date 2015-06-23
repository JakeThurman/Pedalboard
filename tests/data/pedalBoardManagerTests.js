define([ "pedalBoardManager", "jquery", "helperMethods" ], function (pedalBoardManager, $, helpers) {
    describe("data/pedalBoardManager.js", function () {
		    var manager;
				var $fakeEl = $("#notARealId");
				
				beforeEach(function () {
				    manager = pedalBoardManager.create();
				});
				
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
				});
				
				describe("Add", function () {
				});
				
				describe("Rename", function () {
				});
				
				describe("Delete", function () {
				});
				
				describe("DeleteAll", function () {
				});
				
				describe("AddPedal", function () {
				});
				
				describe("RemovePedal", function () {
				});
				
				describe("Clear", function () {
				});
		});
});