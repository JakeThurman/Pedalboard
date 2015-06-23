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
		});
});