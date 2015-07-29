define([ "pedalBoardStorage" ], function (storage) {
	"use strict";
	
	/* Change the localStorage item name so as not to overwrite the real save. */
	storage.SOTORAGE_NAME_PREFIX = "testing-";

	describe("data/pedalBoardStorage.js", function () {
		afterEach(function () {
			storage.Clear();
		});
	
		describe("Clear", function () {
			it("should clear the save", function () {
				expect(function () {
					storage.Clear();
				}).not.toThrow();
			});
		});
		
		describe("Save", function () {
			it("should save", function () {
				expect(function () {
					storage.Save([], []);
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
				storage.Save([{ test: 123 }], ["undo"]);
			
				expect(storage.Load()).toEqual({ history: [{ test: 123 }], undo: ["undo"] });
				expect(storage.Load().history).toEqual([{ test: 123 }]);
				expect(storage.Load().undo).toEqual(["undo"]);
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