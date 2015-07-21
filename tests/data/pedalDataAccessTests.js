define([ "helperMethods", "pedalDataAccess" ], function (helpers, pedalDataAccess) {
	describe("data/pedalDataAccess", function () {
		/* if there was an error with unique ids, this helper logs the bad items */
		function logBad(distincts, all) {
			if (distincts.length === all.length)
				return;
	
			var usedIds = [];
			var badId;
			helpers.forEach(all, function (pedal) {
				if (usedIds.indexOf(pedal.id) !== -1)
					badId = pedal.id;
				
				usedIds.push(pedal.id);
			});
			
			console.log("Bad id is: " + badId);
			
			console.log(helpers.where(all, function (pedal) {
				return pedal.id === badId;
			}));
		}
		
		describe("types", function () {
			it("should all have unique ids", function () {
				var distinctTypes = helpers.distinct(pedalDataAccess.types, function (type) {
					return type.id;
				});
				
				expect(distinctTypes.length).toEqual(pedalDataAccess.types.length);
				
				logBad(distinctTypes, pedalDataAccess.types);
			});
		});
		
		describe("pedals", function () {
			it("should all have unique ids", function () {
				var distinctPedals = helpers.distinct(pedalDataAccess.allPedals, function (pedal) {
					return pedal.id;
				});
				
				expect(distinctPedals.length).toEqual(pedalDataAccess.allPedals.length);
				
				logBad(distinctPedals, pedalDataAccess.allPedals);
			});
			
			it("should all have valid type ids", function () {
				var typeIds = helpers.select(pedalDataAccess.types, function (type) {
					return type.id;
				});
				
				var pedalTypeIsValid = helpers.select(pedalDataAccess.allPedals, function (pedal) {
					return typeIds.indexOf(pedal.type) !== -1;
				});
				
				expect(pedalTypeIsValid.length).toBeGreaterThan(0);
				
				helpers.forEach(pedalTypeIsValid, function (validity) {
					expect(validity).toBe(true);
				});
			});
			
			it("should have not floating point prices (in cents!) to avoid floating point errors", function () {
				helpers.forEach(pedalDataAccess.allPedals, function (pedal) {
					expect(pedal.price % 1).toBe(0);
				});
			});
		});
		
		describe("boards", function () {
			it("should all have unique ids, including lines inside of them!", function () {
				/*
				 * Get all of the pedals bands and lines in the data for this brand and add
				 * each one to the allLinesAndBrands array stack until it reaches a pedal.
				 */
				var allLinesAndBrands = [];
				helpers.forUntilBottom(pedalDataAccess.brands, function (maybePedal) {
						var isPedal = maybePedal.identifier === 2; /* is this a pedal object? if 2: it is */
						
						if (!isPedal) allLinesAndBrands.push(maybePedal);
						
						return isPedal;
					}, 
					function (pedalContainer) { /* Get the child pedal collection (since this is not one) */
						return pedalContainer.pedals;
					},
					function () { /* When a pedal is found do nothing */});
								
				var distinctLinesAndBrands = helpers.distinct(allLinesAndBrands, function (lineOrBrand) {
					return lineOrBrand.id;
				});
				
				expect(distinctLinesAndBrands.length).toEqual(allLinesAndBrands.length);
				
				logBad(distinctLinesAndBrands, allLinesAndBrands);
			});
		});
	});
});