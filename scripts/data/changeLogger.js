define([ "helperMethods", "async" ], function ( helpers, async ) {
	"use strict";
		
	/*
	 * The change logger "class"
	 *
	 * PARAMS:
	 *   @initalChanges: [OPTIONAL] The Array<change/batch> to init logger.changes as
	 */
	return function (initalChanges) {
		/* A param on methods so the caller can disable. (For unit tests) */
		this.CALLBACK_ASYNC = true;
		
		/* assert that if the caller gave us an initalChanges changes collection that it is an array */
		if (!helpers.isUndefined(initalChanges) && !helpers.isArray(initalChanges))
			throw "initalChanges must be an array";
		
		var changeLogger = this;
		
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
			function () { /* @bottomAction */
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
		
		/* Batch Logic */
		var batchStack = [];	
		
		function batchIsRunning() {
		   return batchStack.length !== 0;
		}
		
		function getCurrentBatch() {
		   return batchIsRunning() 
			   ? batchStack[batchStack.length - 1]
			   : changeLogger;
		}
		
		/* [PRIVATE] calls all of the change callbacks. */
		var callbacks = [];
				
		function callCallbacks(arg) {
			function call(callbacks, batchRunning, arg) {
				helpers.forEach(callbacks, function (callback) {
					if (!callback.waitForBatchCompletion || (callback.waitForBatchCompletion && !batchRunning))
						callback.func(arg);
				});
			}
		
			var batchRunning = batchIsRunning();
			
			if (changeLogger.CALLBACK_ASYNC)
				async.run(call, callbacks, batchRunning, arg);
			else
				call(callbacks, batchRunning, arg);
		}
		
		var enabled = true; /* Used by dontLog to temporarily disable logging */
		
		/* ! Public Methods ! */	
		/*
		 * Logs a change and calls the change callbacks (Unless this is nested inside of .dontLog call)
		 *
		 * @batchType:    The type of the batchType (from batchTypes "enum")
		 * @objId:        The id of the object changed
		 * @objName:      The name of the object (used in change description generation)
		 * @batchChanges: A function to run to get the changes to log as children of this batch
		 */
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
			
			/* Create a new batch */		
			batchStack.push(new Batch(batchType, objId, objName));
			
			/* Run the code that will put changes inside this batch */
			batchChanges();
			
			/* Remove the top batch since it's now done */
			var batch = batchStack.pop();
			
			/* Trigger the callbacks */
			callCallbacks(batch);
			
			/* Push this batch as a change in the top batch/top level. */
			if (enabled) /* but only if we aren't inside a don't log */
				getCurrentBatch().changes.push(batch);
		};
		
		/*
		 * Logs a change and calls the change callbacks (Unless this is nested inside of .dontLog call)
		 *
		 * @changeType: The type of the change (from changeTypes "enum")
		 * @objType:    The type of the object (from objectTypes "enum")
		 * @objId:      The id of the object changed
		 * @oldValue:   The old value of the object
		 * @newValue:   The new value of the object
		 * @objName:    The name of the object (used in change description generation)
		 * @otherName:  Some secondary name (used in change description generation)
		 */
		changeLogger.log = function (changeType, objType, objId, oldValue, newValue, objName, otherName) {
			/* Make sure the changeType is a number */
			if (changeType === "" || isNaN(new Number(changeType)))
				throw new TypeError("@changeType should be a number from the changeInfo.js changeTypes \"enum\". Was: " + changeType);
			/* Make sure the changeType is a number */
			if (objType === "" || isNaN(new Number(objType)))
				throw new TypeError("@objType should be a number from the changeInfo.js objectTypes \"enum\". Was: " + objType);
			
			/* Create a change object */
			var change = new Change(changeType, objType, objId, oldValue, newValue, objName, otherName);
			
			/* Push this change as a change in the top batch/top level. */
			if (enabled) /* If we are inside of a DontLog function, don't save any changes */
				getCurrentBatch().changes.push(change);
	
			/* Trigger the callbacks */
			callCallbacks(change);
		};
		
		/*
		 * Don't log any changes made while this is logging.
		 *
		 * @func: Makes all containing logger.log calls no-opperation.
		 */
		changeLogger.dontLog = function (func) {
			if (typeof func !== "function") throw new TypeError("dontLog takes a function");
			
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
		
		/*
		 * Add a change callback
		 *
		 * @waitForBatchCompletion: [DEFAULT: true] Should this function be called on changes made inside of a batch?
		 * @func:                   The action to be executed on every change.
		 *                              params: @change: The change/batch object just created by the logger.
		 *
		 * @returns:                A kill function. Call the result of this function to kill the callback.
		 */
		changeLogger.addCallback = function (waitForBatchCompletion, func) {
			/* If no @waitForBatchCompletion param was given, fix the variables */
			if (helpers.isUndefined(func) && typeof waitForBatchCompletion === "function") {
				func = waitForBatchCompletion;
				waitForBatchCompletion = true;
			}
			if (typeof func !== "function")
				throw new TypeError("changeLogger.addCallback takes a function to be called when a change is made.");
			
			callbacks.push({ func: func, waitForBatchCompletion: waitForBatchCompletion });
			
			/* Return a kill function */
			return function () {
				callbacks = helpers.where(callbacks, function (callback) {
					return callback.func !== func && waitForBatchCompletion !== waitForBatchCompletion;
				});
			};
		};
	};
});
