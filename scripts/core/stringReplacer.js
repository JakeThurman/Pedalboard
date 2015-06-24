define([ "helperMethods", "textResources" ], function ( helpers, resources ) {
    var replacer = {};
	
	/*
	 * replaces instances of /{[a-zA-Z0-9]+}/ in the string @str
	 * by looking up the value inside the braces as indexed from object or array @lookup
	 *   -> @str can also be a single string that will be automatically wrapped in an array
	 * 
	 * if no value is provided for lookup, it will default to the textResources file
	 */
	replacer.replace = function (str, lookup) {
		/* if there is no lookup, use resources */
		if (helpers.isUndefined(lookup)) 
			lookup = resources;
		
		/* wrap lookup in an array if it's a string */
		else if (typeof lookup === "string")
			lookup = [lookup];
		
		/* if there is a lookup, assert that it's an object or an array */
		else if (!helpers.isObjectOrArray(lookup)) 
			throw new Error("lookup parameter must be an object or array (or a single string to be put in a single item array)! Actual: " + lookup);
		
		/* find all instances of curly brace wrapped strings */
		return str.replace(/{[a-zA-Z0-9]+}/, function(match, i) { 
		      /* remove the curly braces */
			  var key = match.slice(1, match.length - 1);
			  
			  /* try to replace the string */
			  return !helpers.isUndefined(lookup[key])
				  ? lookup[key]
				  : match; /* if there is no value for this: leave it */
		});
	};
	
	return replacer;
});