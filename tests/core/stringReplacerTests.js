define([ "stringReplacer" ], function ( replacer ) {
    describe("core/stringReplacer.js", function () {
	    describe("replace", function () {		
		    it("should replace string resources from an object", function () {
			    expect(replacer.replace("hello {test}", { test: "bob" })).toEqual("hello bob");
			});
			
			it("should replace string resources from an array", function () {
			    expect(replacer.replace("hello {0}", [ "joe" ])).toEqual("hello joe");
			});
			
			it("should throw an error if a lookup is not a valid object/array", function () {
				var thrower = function () {
					replacer.replace("test {0}", "");
				};
				
			    expect(thrower).toThrow();
			});
			
			it("should leave any curly braced wrapped strings can't be replaced", function () {
				expect(replacer.replace("hello {test}", {})).toEqual("hello {test}");
			});
		});
	});
});