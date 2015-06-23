define([ "pedalBoardManager", "jquery", "helperMethods" ], function (pedalBoardManager, $, helpers) {
    describe("data/pedalBoardManager.js", function () {
		    var manager;
				
				beforeEach(function () {
				    manager = pedalBoardManager.create();
				});
				
				describe("GetBoard", function () {				
				    it("should return a board with the given id", function () {
						   /* setup */
							 var domBoard = manager.Add("Test", $("#notARealId"));
							 var id = domBoard.options.id;
							 
							 /* test */
							 var ouput = manager.GetBoard(id);
							 expect(ouput.dom).toBe(domBoard);
						});		
						
						it("should return undefined when the given id does not exist", function () {
						   expect(helpers.isUndefined(manager.GetBoard("Fake-id from:" + new Date()))).toBe(true);		 
						});
				});
				
				describe("GetBoards", function () {
				});
				
				describe("Any", function () {
				});
				
				describe("Multiple", function () {
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