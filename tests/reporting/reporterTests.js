define([ "reporter", "reportTypes", "pedalBoardClasses" ], function (reporter, types, classes) {
	"use strict";
	describe("reporting/reporter.js", function () {
		describe("report", function () {
			var board = new classes.PedalBoard();
			
			it("should throw a type error if the pedal board is not a valid board", function () {
				expect(function () { reporter.report({}, types.price); }).toThrowError(TypeError);
			});
			
			it("should throw a error if the type is not valid", function () {
				expect(function () { reporter.report(board, {}); }).toThrowError(Error);
			});
		});
		
		describe("compare", function () {
			it("should throw a type error if the pedal board is not a valid board", function () {
				expect(function () { reporter.compare({}, types.price); }).toThrowError(TypeError);
			});
			
			it("should throw a error if the type is not valid", function () {
				expect(function () { reporter.compare(board, {}); }).toThrowError(Error);
			});
		});
		
		/* getData(items, getName, getValue, getColor) */
		describe("getData", function () {
			var getData = reporter.__privates.getData;
			
			it("should loop on the given collection and call some passed in functions to get data", function () {
				var result;
				var color = "#abcdef";
				var name = "name";
				var nameConcat = "-test";
				var expectedName = "name-test";
				var value = 2.2;
				
				expect(function () {
					result = getData([{ 
							name: name,
							num: value, 
						}], 
						function (item) {
							return item.name + nameConcat;
						},
						function (item) {
							return item.num;
						},
						function () {
							return color;
						});
				}).not.toThrow();
				
				expect(result[0].color).toEqual(color);
				expect(result[0].value).toEqual(value);
				expect(result[0].label).toEqual(expectedName);
			});
		});
	});
});