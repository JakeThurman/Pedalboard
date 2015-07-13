define([ "helperMethods" ], function ( helpers ) {
	var methods = {};
	
	methods.create = function (initalChanges) {
		/* assert that if the caller gave us an initalChanges changes collection that it is an array */
		if (!helpers.isUndefined(initalChanges) && !helpers.isArray(initalChanges))
			throw "initalChanges must be an array";
		
		var changeLogger = {};
		
		changeLogger.changes = initalChanges || [];
		
		/* classes */
		var topChangeId = changeLogger.changes.length;
		function Change(description, changeType, objId, objType) {
			/* Info */
			this.description = description;
			this.changeType = changeType;
			this.objId = objId;
			this.objType = objType;
			/* Data */
			this.id = "change-" + topChangeId++;
			this.isBatch = false;
			this.timeStamp = new Date();
		}
		
		var topBatchId = changeLogger.changes.length;
		function Batch(description, changes) {
			/* Info */
			this.description = description;
			this.changes = changes || [];
			/* Data */
			this.id = "batch-" + topBatchId++;
			this.isBatch = true;
		}
		
		/* batch logic */
		var batchStack = [];	
		
		function batchIsRunning() {
		   return batchStack.length !== 0;
		}
		
		function getCurrentBatch() {
		   return batchIsRunning() 
			   ? batchStack[batchStack.length - 1]
			   : void(0); /* undefined */
		}
		
		var enabled = true; /* Used by dontLog to temporarily disable logging */
		
		/* ! Public Methods ! */	
		changeLogger.batch = function (desc, batchChanges) {
			/* check and correct params if there is no description */
			if (typeof desc === "function") {
				batchChanges = desc;
				desc = void(0); /* undefined */
			}
			
			/* Do nothing if there is nothing to do */
			if (!enabled || helpers.isUndefined(batchChanges)) return;
			
			
			/* create a new batch */		
			batchStack.push(new Batch(desc));

			/* run the code that will put changes inside this batch */
			batchChanges();
					
			/* remove the top batch since it's now done */
			var batch = batchStack.pop();
			
			if (batchIsRunning()) /* push this batch as a change in the now top batch */
				getCurrentBatch().changes.push(batch);
			else /* Otherwise, push this batch as a complete change */
				changeLogger.changes.push(batch);;
		};
		
		changeLogger.log = function (desc, changeType, objId, objType) {
			/* If we are inside of a DontLog function, don't save any changes */
			if (!enabled) return;
			
			/* Assert that the client gave us a description */
			if (typeof desc !== "string") 
				throw new Error("No description was provided to Log!");		
			/* Make sure the changeType is a number */
			if (changeType === "" || isNaN(new Number(changeType)))
				throw new TypeError("@changeType should be a number from the changeInfo.js changeTypes \"enum\". Was: " + changeType);
			/* Make sure the changeType is a number */
			if (objType === "" || isNaN(new Number(objType)))
				throw new TypeError("@objType should be a number from the changeInfo.js objectTypes \"enum\". Was: " + objType);
			
			
			var change = new Change(desc, changeType, objId, objType);
		
			if (batchIsRunning()) /* push change to the top batch */
				getCurrentBatch().changes.push(change);
			else /* Otherwise, push this a individual change */
				changeLogger.changes.push(change);
		};
		
		changeLogger.dontLog = function (func) {
			if (typeof func !== "function") throw new TypeError("dontLog takes a function")
			
			/* If logging is already disabled don't try to do it again, if we did
			   that we would also stop logging after the deepest dontLog finishes */
			if (!enabled) {
				func();
				return;
			}
		
			enabled = false; /* Temporarily disable logging */
			func();
			enabled = true; /* Re-enable logging */
		};

		return changeLogger;
	};
	
	return methods;
});
