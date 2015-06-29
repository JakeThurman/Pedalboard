define([ "helperMethods", "pedalBoardClasses" ], function (helpers, classes) {
	var methods = {};
	
	//returns a new pedalboard without any pedals in both this PedalBoard object and a passed in PedalBoard object
	methods.GetUniquePedals = function(main, other) {
		if (!(main instanceof classes.PedalBoard) || !(other instanceof classes.PedalBoard))
			throw "parameters must be valid pedalboard objects";
		
		var otherBoardPedalIds = helpers.select(other.pedals, function (pedal) { 
			return pedal.id; 
		});	
		
		return helpers.where(main.pedals, function(pedal) {
			return otherBoardPedalIds.indexOf(pedal.id) === -1; //Where the other board does not contain this pedal
		});
	};
	
	return methods;
});