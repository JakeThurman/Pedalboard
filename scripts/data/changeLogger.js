define([ "helperMethods" ], function ( helpers ) {
	var methods = {};
	
	methods.create = function (initalChanges) {
		/* assert that if the caller gave us an initalChanges changes collection that it is an array */
		if (!helpers.isUndefined(initalChanges) && !helpers.isArray(initalChanges))
			throw "initalChanges must be an array";
		
		var changeLogger = {};
		
		changeLogger.changes = initalChanges || [];
		
		/* Loop through all of the existing changes and batches and count them so that we don't end up with duplicate ids */
		var topChangeId = 0;
		var topBatchId = 0;
		helpers.forUntilBottom(changeLogger.changes, 
			function (change) { /* @isBottomFilterAction */
				if (change.isBatch)
					topBatchId++;
				
				return !change.isBatch;
			},
			function (change) { /* @getChildCollectionAction */
				return change.changes;
			},
			function (change) { /* @bottomAction */
				topChangeId++;
			});
		
		/* classes */
		function Change(changeType, objType, objId, oldValue, newValue, objName, otherName) {
			/* Info */
			this.changeType = changeType;
			this.objId = objId;
			this.objType = objType;
			/* Resource information helper */
			this.objName = objName;
			this.otherName = otherName;
			/* Data */
			this.id = "c-" + topChangeId++;
			this.timeStamp = new Date();
			this.oldValue = oldValue;
			this.newValue = newValue;
		}
		
		function Batch(batchType, objId, objName) {
			/* Info */
			this.batchType = batchType;
			this.objId = objId;
			this.changes = [];
			/* Resource information helper */
			this.objName = objName;
			/* Data */
			this.id = "b-" + topBatchId++;
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
			   : changeLogger;
		}
		
		var enabled = true; /* Used by dontLog to temporarily disable logging */
		
		/* ! Public Methods ! */	
		changeLogger.batch = function (batchType, objId, objName, batchChanges) {
			/* If the optional param pair @objId & @objName were not given, fix the variables */
			if (typeof objId === "function" && helpers.isUndefined(batchChanges) && helpers.isUndefined(objName)) {
				batchChanges = objId;
				objId = void(0);
			}			
			else if (helpers.isUndefined(batchChanges) || (helpers.isUndefined(objName) !== helpers.isUndefined(objId)))
				throw new TypeError("@batchChanges is required. Also, if @objName is given, @objId is required (and vice versa)");
		
			/* Make sure the changeType is a number */
			if (batchType === "" || isNaN(new Number(batchType)))
				throw new TypeError("@batchType should be a number from the changeInfo.js batchType \"enum\". Was: " + batchType);
			/* Make sure the changeType is a number */
			
			/* Do nothing if there is nothing to do */
			if (!enabled || helpers.isUndefined(batchChanges)) return;
			
			/* Create a new batch */		
			batchStack.push(new Batch(batchType, objId, objName));
			
			try {
				/* Run the code that will put changes inside this batch */
				batchChanges();
			}
			catch (e){
				batchStack.pop(); /* on fail, kill the batch */
				throw e;
			}
			
			/* Remove the top batch since it's now done */
			var batch = batchStack.pop();
			
			/* Push this batch as a change in the top batch/top level. */
			getCurrentBatch().changes.push(batch);
		};
		
		changeLogger.log = function (changeType, objType, objId, oldValue, newValue, objName, otherName) {
			/* If we are inside of a DontLog function, don't save any changes */
			if (!enabled) return;
			
			/* Make sure the changeType is a number */
			if (changeType === "" || isNaN(new Number(changeType)))
				throw new TypeError("@changeType should be a number from the changeInfo.js changeTypes \"enum\". Was: " + changeType);
			/* Make sure the changeType is a number */
			if (objType === "" || isNaN(new Number(objType)))
				throw new TypeError("@objType should be a number from the changeInfo.js objectTypes \"enum\". Was: " + objType);
			
			/* Create a change object */
			var change = new Change(changeType, objType, objId, oldValue, newValue, objName, otherName);
			
			/* Push this change as a change in the top batch/top level. */
			getCurrentBatch().changes.push(change);
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
