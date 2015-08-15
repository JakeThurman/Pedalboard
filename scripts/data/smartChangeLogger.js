define([ "ChangeLogger", "batchTypes", "objectTypes" ], function ( ChangeLogger, batchTypes, objectTypes ) {
	/*
	 * Does the closest thing you can in javascript to inheritance on top of ChangeLogger
	 *
	 * PARAMS:
	 *   @initalChanges: [OPTIONAL] The Array<change/batch> to init logger.changes as
	 */
	return function () {
		/* Create a new ChangeLogger instance, passing in all of the arguments given here. */
		var logger =new ChangeLogger(arguments[0], arguments[1], arguments[2], arguments[3]);
		
		/* Save the original log function so we still have it when we overwrite it later */
		var baseLog = logger.log;
		
		function objTypeMatches(a, b) {
			if (a === b)
				return true;
			
			/* Count pedalboard/pedal edits as the same objectType */
			return (a === objectTypes.pedalboard || a === objectTypes.pedal)
				&& (b === objectTypes.pedalboard || b === objectTypes.pedal)
		}
				
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
		logger.log = function () {
			var args = arguments;
			function base() {
				baseLog.apply(null, args);
			}
			
			/* The change we need to check against */
			var lastChange = logger.pop(/* remove: */ false);
			
			/* If there is no last change, log the current change now. */
			if (!lastChange)
				return base();
			
			/* If there is already a batch running, log the new change and leave */
			var currentBatch = logger.getCurrentBatch();
			if(currentBatch.isBatch)
				return base();
			
			/* The values we need to check */
			var changeType = args[0];
			var objType    = args[1];
			var objId      = args[2];
			var objName    = args[5];
			
			/* If the user made the change a different object just log this change and be done with it */
			if (objId !== lastChange.objId || !objTypeMatches(objType, lastChange.objType))
				return base();
			
			/* Remove the last change so we can re-log it in a batch */
			logger.pop();
			
			var logChanges = function () {
				/* Log the matched previous change */
				if (lastChange.isBatch && lastChange.batchType === batchTypes.smartBatch)
					logger.push(lastChange.changes);
				else 
					logger.push(lastChange);
				
				/* Log this change */
				base();
			};
			
			/* Log the changes in the new smartBatch change batch */
			logger.batch(batchTypes.smartBatch, objType, objId, objName, logChanges);
		};
		
		return logger;
	};
});