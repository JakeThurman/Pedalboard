define([ "pedalBoardStorage" ], function (storage) {
	describe("data/pedalBoardStorage.js", function () {
		describe("Clear", function () {
			it("should clear the save", function () {
				expect(function () {
					storage.Clear()
				}).not.toThrow();
			});
		});
		
		describe("Save", function () {
			it("should save", function () {
				expect(function () {
					storage.Save([]);
				}).not.toThrow();
			});
		});
		
		describe("Load", function () {
			it("should load the save without error", function () {
				expect(function () {
					storage.Load();
				}).not.toThrow();
			});
			
			it("should load the save", function () {
				storage.Save([{ test: 123 }]);
			
				expect(storage.Load()).toEqual([{ test: 123 }]);
			});
		});
		
		describe("HasSavedData", function () {
			it("should return true or false", function () {
				storage.Clear();
				expect(storage.HasSavedData()).toBe(false);
				
				storage.Save([]);			
				expect(storage.HasSavedData()).toBe(true);
			});
		});
		
		describe("GetDefaultBoard", function () {
			it("should get a board data object", function () {
				var board = storage.GetDefaultBoard();
			
				expect(board.data).not.toBeUndefined();
				expect(board.data.Name).not.toBeUndefined();
				expect(board.clientRect).not.toBeUndefined();
				expect(board.clientRect.left).not.toBeUndefined();
				expect(board.clientRect.top).not.toBeUndefined();
				expect(board.clientRect.width).not.toBeUndefined();
			});
		});
	});
});