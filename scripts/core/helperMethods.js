define(function () {
			var helpers = {};
			
			//Just throws the msg, makes for easier inlining of logic.
			helpers.throwThis = function (msg) {
			    throw msg;
			};
			
			//returns true if the param is undefined
			helpers.isUndefined = function(maybeSomething) {
			    return typeof maybeSomething === "undefined";
			};
			
			//returns true if the param is an object or array.
			helpers.isObjectOrArray = function (maybe) {
			    return typeof maybeObject === "object";
			};
			
			//return true if the param is an "object". Arrays not included!
			helpers.isObject = function(maybeObject) {
			    return typeof maybeObject == "object" && helpers.isUndefined(maybeObject.length);
			};
			
			//returns true if the param is an array.
			helpers.isArray = function(maybeArray) {
			    return typeof maybeArray == "object" && !helpers.isUndefined(maybeArray.length);
			};
			
			//if the param is an array, it returns it, other wise it returns the object as an array of one
			helpers.asArray = function (maybeArray) {
				if (helpers.isUndefined(maybeArray)) 
					 return [];
				if (!helpers.isArray(maybeArray))
					 return [maybeArray];
				
			  return maybeArray;
			};

			//Loops through the array (collection) and calls the passed in function (action) on each item
      helpers.forEach = function (collection, action) {
					collection = helpers.asArray(collection);
					
          for (var i = 0; collection.length > i; i++)
              action(collection[i]);
      };
			
			//Loops through the passed in collection
			// if the isBottomFilterAction(collection[i]) fucntion returns true:
			// 		the bottomAction(collection[i])
			// otherwise:
			// 		the function is recurrsed until the isBottomFilterAction responds that this is the bottom
			//    the getChildCollectionAction(collection[i]) is also first called, and should return the array collection of that object
			//				if the object is the collection, the function can just return the input.
			helpers.forUntilBottom = function (collection, isBottomFilterAction, getChildCollectionAction, bottomAction) {
					helpers.forEach(collection, function (obj) {
							if (isBottomFilterAction(obj))
								 	 bottomAction(obj);
							else
									 helpers.forUntilBottom(getChildCollectionAction(obj), isBottomFilterAction, getChildCollectionAction, bottomAction);
					});
			};
			
			//forEach wrapper that loops through an array and calls a passed in function
			// on each item and adds it to a new array which is then returned
			helpers.select = function (collection, selectAction) {
						var newCollection = [];
						helpers.forEach(collection, function (obj) {
								newCollection.push(selectAction(obj));
						})
						return newCollection;						
			};
			
			//forEach wrapper that loops through an array and calls a passed in function
			// on each item and if it returns true, it to a new array which is then returned
			helpers.where = function (collection, whereFilterAction) {
						var newCollection = [];
						helpers.forEach(collection, function (obj) {
								if (whereFilterAction(obj))
									 newCollection.push(obj);
						})
						return newCollection;
			};
			
			//returns the [0] of the collection. BUT, if that is not the case one of the
			// passed in functions is called (which one, depending on the case)
			helpers.single = function(collection, moreThanOneResultsAction, zeroResultsAction) {
			   if (collection.length <= 0)
				     return zeroResultsAction ? zeroResultsAction() : helpers.throwThis("No results.");
				 else if (collection.length > 1)
				     return moreThanOneResultsAction ? moreThanOneResultsAction() : helpers.throwThis("Too many results.");
				 else
				 		 return collection[0];
			};
			
			//Gets the first item in a collection or returns the passed in function if there are none
			helpers.first = function (collection, zeroResultsAction) {
				 if (collection.length === 0)
				     return zeroResultsAction ? zeroResultsAction() : helpers.throwThis("No results.");
				 else
				 		 return collection[0];
			};
			
			//provides a deep clone for objects
			helpers.clone = function (object) {
			   ///handle arrays
			   if (helpers.isArray(object)) {
				     return helpers.select(object, function (arrayobj) {
    				     helpers.clone(arrayobj);
    				 });
				 }
			   
				 //clone each property				 
			   var newObject = {};
			   for (var key in object) {
				     if (helpers.isObjectOrArray(object[key]))
						     newObject[key] = helpers.clone(object[key]);
						 else
				         newObject[key] = object[key];
				 }
				 return newObject;
			};
			
			return helpers;
});