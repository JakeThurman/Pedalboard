define(["defaults"], function (defaults) {
	"use strict";
	
	describe("defaults", function() {
		describe("boards", function () {
			it("should be an array of board objects", function () {
				var board = defaults.boards[0];
			
				expect(board.data).not.toBeUndefined();
				expect(board.data.Name).not.toBeUndefined();
				expect(board.clientRect).not.toBeUndefined();
				expect(board.clientRect.left).not.toBeUndefined();
				expect(board.clientRect.top).not.toBeUndefined();
				expect(board.clientRect.width).not.toBeUndefined();
			});
		});
		describe("changes", function () {
			it("should be an array of change objects", function () {
				var change = defaults.changes[0];
				
				expect(change.changeType).not.toBeUndefined();
				expect(change.objId).not.toBeUndefined();
				expect(change.objType).not.toBeUndefined();
				expect(change.id).not.toBeUndefined();
				expect(change.timeStamp).not.toBeUndefined();
			});
		});
	});
});