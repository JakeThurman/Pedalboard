define([ "helperMethods" ], function ( helpers, undef ) {
    describe("core/helperMethods.js", function () {
        describe("throwThis", function () {				 
    		    it("should throw the passed in string", function () {
    				    var msg = "This is a test error message";
    		
    		        var thrower = function () {
    				        helpers.throwThis(msg)
    				    };
    				
    						expect(thrower).toThrow()
    						expect(thrower).toThrowError(msg);
    				});
    		});
    		
				describe("isUndefined", function() {
				    it("should return true for undefined", function () {
						     expect(helpers.isUndefined(undef)).toBe(true);
						});
						
						it("should return true for null", function () {
						     expect(helpers.isUndefined(null)).toBe(true);
						});
						
						it("should return false for an empty string", function () {
						     expect(helpers.isUndefined("")).toBe(false);
						});
						
						it("should return false for an empty array", function () {
						    expect(helpers.isUndefined([])).toBe(false);
						});
						
						it("should return false for an empty object", function () {
						    expect(helpers.isUndefined({})).toBe(false);
						});
						
						it("should return false for a function", function () {
						    expect(helpers.isUndefined(function () {})).toBe(false);
						});
				});
				
				describe("isObjectOrArray", function () {
				    it("should return false for undefined", function () {
						     expect(helpers.isObjectOrArray(undef)).toBe(false);
						});
						
						it("should return false for null", function () {
						     expect(helpers.isObjectOrArray(null)).toBe(false);
						});
						
						it("should return false for an empty string", function () {
						     expect(helpers.isObjectOrArray("")).toBe(false);
						});
						
						it("should return true for an empty array", function () {
						    expect(helpers.isObjectOrArray([])).toBe(true);
						});
						
						it("should return true for an empty object", function () {
						    expect(helpers.isObjectOrArray({})).toBe(true);
						});
						
						it("should return false for a function", function () {
						    expect(helpers.isObjectOrArray(function () {})).toBe(false);
						});
						
						it("should return false for no param", function () {
						    expect(helpers.isObjectOrArray()).toBe(false);
						});
				});				
    		
				describe("isObject", function () {
				    it("should return false for undefined", function () {
						     expect(helpers.isObject(undef)).toBe(false);
						});
						
						it("should return false for null", function () {
						     expect(helpers.isObject(null)).toBe(false);
						});
						
						it("should return false for an empty string", function () {
						     expect(helpers.isObject("")).toBe(false);
						});
						
						it("should return false for an empty array", function () {
						    expect(helpers.isObject([])).toBe(false);
						});
						
						it("should return true for an empty object", function () {
						    expect(helpers.isObject({})).toBe(true);
						});
						
						it("should return false for a function", function () {
						    expect(helpers.isObject(function () {})).toBe(false);
						});
						
						it("should return false for no param", function () {
						    expect(helpers.isObject()).toBe(false);
						});
    		});
    		
				describe("isArray", function () {
				    it("should return false for undefined", function () {
						     expect(helpers.isArray(undef)).toBe(false);
						});
						
						it("should return false for null", function () {
						     expect(helpers.isArray(null)).toBe(false);
						});
						
						it("should return false for an empty string", function () {
						     expect(helpers.isArray("")).toBe(false);
						});
						
						it("should return true for an empty array", function () {
						    expect(helpers.isArray([])).toBe(true);
						});
						
						it("should return false for an empty object", function () {
						    expect(helpers.isArray({})).toBe(false);
						});
						it("should return false for a function", function () {
						    expect(helpers.isArray(function () {})).toBe(false);
						});
						
						it("should return false for no param", function () {
						    expect(helpers.isArray()).toBe(false);
						});
    		});
    		
				describe("asArray", function () {
    		    it("should not change a valid array containing an empty string", function () {
						    expect(helpers.asArray([""])).toEqual([""]);
						});
						
						it("should not change a valid array containing an empty object", function () {
						    expect(helpers.asArray([{}])).toEqual([{}]);
						});
						
						it("should return an empty array for no param", function () {
						    expect(helpers.asArray()).toEqual([]);
						});
						
						it("should return an empty array for no undefined", function () {
						    expect(helpers.asArray(undef)).toEqual([]);
						});
						
						it("should return an array containing an empty object when an empty object is passed in", function () {
						    expect(helpers.asArray({})).toEqual([{}]);
						});
						
						it("should reutrn an array containing a function that is passed in", function () {
						    var func = function () {};
						    expect(helpers.asArray(func)).toEqual([func]);
						});
    		});
				
				describe("forEach", function () {
				    it("should call an action for every item in an array", function () {
						    var arr = ["1", "2", "3"];
								
								var output = [];
								
								helpers.forEach(arr, function (num) {
								    output.push(num);
								});
						
						    expect(arr).toEqual(output);
						});
						
						it("should wrap other types of params in array and the callback once on that", function () {
						    var count = 0;
								var obj = {};
								
								var output;
								helpers.forEach(obj, function (something) {
								    output = something;
										count++;
								});
								
								expect(output).toEqual(obj);
								expect(count).toEqual(1);
						});
						
						it("should never call the action from an empty array", function () {
						    var actionCalled = false;
								
								helpers.forEach([], function () {
								    actionCalled = true;
								});
								
								expect(actionCalled).toBe(false);
						});
				});
				
				/* (collection, isBottomFilterAction, getChildCollectionAction, bottomAction) */
				describe("forUntilBottom", function () {
				    it("should not keep searching when it finds the bottom of a stack", function () {
						    var testData = [
								    {
  										next: [
  										    { bottom: true }
  										]
										}, 
										{
										  bottom: true,
										  next: [
											   { bottom: true },
												 { bottom: true }
											]
										}, 
										{
											next: [
											   { bottom: true }, 
												 { bottom: true },
												 { bottom: true }
											]
										}
								];
								
								var bottomCount = 0;
						    helpers.forUntilBottom(testData, 
								    function (obj) {
										    return obj.bottom;
										},
										function (obj) {
										    return obj.next;
										},
  								  function () { /* Bottom Action */
  								      bottomCount++;
  								  });
								
								expect(bottomCount).toEqual(5); /* See those six on the bottom! */
						});
				
				    it("should not call any action for an empty collection", function () {
						    var actionCalled = false;
								
								var action = function () {
								    actionCalled = true;
								};
								
								helpers.forUntilBottom([], action, action, action);
								
								expect(actionCalled).toBe(false);
						});
				});
				
				describe("select", function () {
				    it("should select the items it's told to", function () {
						    var testArr = [
								    { data: { data: {} } },
								    { data: { data: {} } },
										{ data: { data: {} } },
								];
								
								var expected = [
								   {}, {}, {},
								];
						
						    var output = helpers.select(testArr, function (obj) {
								    return obj.data.data;
								});
								
								expect(output).toEqual(expected);
						});
				});
				
				describe("where", function () {
				    it("should filter to only object where a predicate returns true", function () {
						    var data = [1, 2, 3];
								
								var filtered = helpers.where(data, function (num) {
								    return num === 2;
								});
								
								expect(filtered).toEqual([2]);
						});
						
						it("should include duplicate results", function () {
						    var data = [1, 2, 2, 3, 2];
								
								var filtered = helpers.where(data, function (num) {
								    return num === 2;
								});
								
								expect(filtered).toEqual([2, 2, 2]);
						});
						
						it("should return the same array if the predicate always returns true", function () {
						    var data = [1, 2, 3];
								
								var filtered = helpers.where(data, function (num) {
								    return true; /* Keep all */
								});
								
								expect(filtered).toEqual(data);
						});
												
						it("should return the an empty array if the predicate finds no maches", function () {
						    var data = [1, 2, 3];
								
								var filtered = helpers.where(data, function (num) {
								    return false; /* throw away all */
								});
								
								expect(filtered).toEqual([]);
						});
				});
				
				/* (collection, moreThanOneResultsAction, zeroResultsAction) */
				describe("single", function () {
				    it("should return the item at index 0 of an array", function () {
						    var data = {};
								expect(helpers.single([data])).toBe(data);
						});
						
						
				    it("should return the value of the proper function if the length != 1", function () {
						    var multi = [1, 2];
						    var zero = [];
								
								var multiResult = "multi";
								var zeroResult = "zero";
								
								var onZero = function () { return zeroResult; };
								var onMulti = function () { return multiResult; };
								
								expect(helpers.single(multi, onMulti, onZero)).toBe(multiResult);
								expect(helpers.single(zero, onMulti, onZero)).toBe(zeroResult);
						});
						
						it("should throw if an action is not provided", function () {
						    var zeroThrower = function () {
								    helpers.single([]);
								};
								
								var multiThrower = function () {
								    helpers.single([1, 2]);
								};
						
						    expect(zeroThrower).toThrow();
						    expect(multiThrower).toThrow();
						});
				});
		});
});