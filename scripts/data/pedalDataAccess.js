define(["pedalBoardClasses", "pedalsGetter", "helperMethods"], function (classes, pedalsGetter, helpers) {
		if (window && window.pedalBoardDataAccessCache)
			 return window.pedalBoardDataAccessCache;
		
		var pedalsData = pedalsGetter.get();
		
		/* Object stack of all the pedal brands */
		var allPedalBrands = [];
		
		/*
		 * Object stack of all of the bottom level pedals from the data.
		 * This will make the data easily searchable later
		 */
		var allPedals = [];
			
		helpers.forEach(pedalsData.Pedals, function (pedalBrandData) {		
			/*
			 * First create this brand, and add it to the new 
			 * allPedalBrands array (which is just captured data).
			 */
			var thisBrand = new classes.PedalBrand(pedalBrandData);
			allPedalBrands.push(thisBrand);
			
			/*
			 * Get all of the pedals in the data for this brand
			 * and add each pedal to the allPedals array stack
			 */
			helpers.forUntilBottom(thisBrand.pedals, function (maybePedal) {
					return maybePedal.identifier === 2; /* is this a pedal object? if 2: it is */
				}, 
				function (pedalContainer) { /* Get the child pedal collection (since this is not one) */
					 return pedalContainer.pedals;
				},
				function (pedal) { /* When a pedal is found... */
					 allPedals.push(pedal);
				});
		});
		
		window.pedalBoardDataAccessCache = {
			brands: allPedalBrands,
			allPedals: allPedals,
			types: helpers.select(pedalsData.PedalTypes, function (type) {
				return new classes.PedalType(type);
			}),
		};
		
		return window.pedalBoardDataAccessCache;
});