define([ "reporter", "reportTypes", "pedalBoardClasses", "pedalDataAccess" ], function (reporter, types, classes, pedalDataAccess) {
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
				var board = new classes.PedalBoard();
				expect(function () { reporter.compare(board, {}); }).toThrowError(Error);
			});
		});
		
		/* getData(items, getName, getValue, getColor) */
		describe("getData", function () {
			var getData = reporter.__privates.getData;
			
			it("should loop on the given collection and call some passed in functions to get data", function () {
				var result;
				var color = "abcdef";
				var name = "name";
				var nameConcat = "-test";
				var expectedName = "name-test";
				var value = 2.2;
				
				var secondItemLabel = "hard-coded";
				var expectedSecondLabel = "hard-coded-test";
				var secondItemValue = 2;
				
				expect(function () {
					result = getData([{ 
							name: name,
							num: value, 
						},
						{
							name: secondItemLabel,
							num: secondItemValue,
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
				
				expect(result[0].color).toEqual("#" + color);
				expect(result[0].value).toEqual(value);
				expect(result[0].label).toEqual(expectedName);
				
				expect(result[1].label).toEqual(expectedSecondLabel);
				expect(result[1].value).toEqual(secondItemValue);
				expect(result[1].color).toEqual("#" + color);
			});
		});
		
		/* getPriceData(pedals) */
		describe("getPriceData", function () {
			var getPriceData = reporter.__privates.getPriceData;
			
			it("should loop on the given \"pedal\" collection and get the displayName, price and color of each", function () {
				var result;
				
				var color1 = "abcdef";
				var name1  = "name_1";
				var price1 = 2.2;
				
				var color2 = "a18b8c";
				var name2  = "name_2";
				var price2 = -100.8;
				
				expect(function () {
					result = getPriceData([{ 
							color: color1,
							price: price1,
							name:  name1,
						},
						{
							color: color2,
							price: price2,
							name:  name2,
						}]);
				}).not.toThrow();
				
				expect(result.length).toEqual(2);
				
				expect(result[0].color).toEqual("#" + color1);
				expect(result[0].value).toEqual(price1);
				expect(result[0].label).toEqual(name1 );
				
				expect(result[1].color).toEqual("#" + color2);
				expect(result[1].value).toEqual(price2);
				expect(result[1].label).toEqual(name2 );
			});
		});
		
		describe("getTypeData", function () {
			var getTypeData = reporter.__privates.getTypeData;

			it("should return data about pedal types", function () {
				var result;
				
				var color1 = "abcdef";
				var name1  = "name_1";
				var price1 = 2.2;
				
				var color2 = "a18b8c";
				var name2  = "name_2";
				var price2 = -100.8;
				
				/* Just take the first one, this should really be mocked out anyway */
				var myType = pedalDataAccess.types[0];
				
				expect(function () {
					result = getTypeData([{ 
							color: color1,
							price: price1,
							name:  name1,
							type: myType.id
						},
						{
							color: color2,
							price: price2,
							name:  name2,
							type: myType.id
						}]);
				}).not.toThrow();
				
				expect(result.length).toEqual(1);
				
				expect(result[0].color).toEqual("#" + color1);
				expect(result[0].value).toEqual(2 /* 2 pedals of this type */);
				expect(result[0].label).toEqual(myType.name);
			}); 
		});
		
		describe("getColorData", function () {
			var getColorData = reporter.__privates.getColorData;

			it("should give back an item for each distinct color after they are rounded", function () {
				var result;
				
				var color1 = "abcdef";
				var name1  = "name_1";
				var price1 = 2.2;
				
				
				var color2 = "a18b8e"; /*close enogh to 3 that this should round with it*/
				var name2  = "name_2";
				var price2 = -100.8;
				
				var color3 = "a18b8c";
				var name3  = "name_2";
				var price3 = -100.8;
				
				expect(function () {
					result = getColorData([{ 
							color: color1,
							price: price1,
							name:  name1,
						},
						{
							color: color2,
							price: price2,
							name:  name2,
						},
						{
							color: color3,
							price: price3,
							name:  name3,
						}]);
				}).not.toThrow();
				
				expect(result.length).toEqual(2);
				
				expect(result[0].color).toEqual("#cccccc"); /* the color pedal 1 should be rounded to */
				expect(result[0].value).toEqual(1 /* only one pedals with this color */);
				expect(result[0].label).not.toBeUndefined();
				
				expect(result[1].color).toEqual("#999999"); /* the color pedals 2 and 3 should be rounded to */
				expect(result[1].value).toEqual(2 /* 2 pedals with this color  */);
				expect(result[1].label).not.toBeUndefined();
			}); 
		});
	});
});