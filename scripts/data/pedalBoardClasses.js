define([ "helperMethods" ], function (helpers) {
	var classes = {};

	classes.PedalBoard = function (name, pedals) {
		this.Name = name;
	 
        var thisBoard = this;
        if (!pedals) pedals = [];
  			this.pedals = pedals;
    
		this.Add = function(pedal) {
			thisBoard.pedals.push(pedal);
		};
				
		this.Remove = function(pedalId){
			var pedalsWithThisId = helpers.where(thisBoard.pedals, function (boardPedal) {
				return boardPedal.id === pedalId;
			});
				
			var pedalToRemove = helpers.single(pedalsWithThisId,
				function() {// more than one result
					//Figure out which one to remove
					console.log("TODO: handle choosing which to delete.");
					return pedalsWithThisId[0];
				},
				function() {// zero results
					throw "There were no pedals with id of: " + pedalId;
				}
			);
				
			var deletedOne = false;
			
			/* We can't use the delete keyword because it leaves a messy undefined in the array. */			
			thisBoard.pedals = helpers.where(thisBoard.pedals, function (pedal) {
				/* Use the already deleted bool to make sure we only delete one instance of this pedal */
				if (deletedOne) return true;
				deletedOne = (pedal.id === pedalToRemove.id);
				return pedal.id !== pedalToRemove.id;
			});
			
			return pedalToRemove;
		};
				
        this.Clear = function () {
            thisBoard.pedals = [];
        };
				
        //returns a new pedalboard without any pedals in both this PedalBoard object and a passed in PedalBoard object
        this.RemoveOverlap = function(other) {
            if (!(other instanceof classes.PedalBoard))
                throw "parameter must be another pedalboard object";
            
			var otherBoardPedalIds = helpers.select(other.pedals, function (pedal) { 
				return pedal.id; 
			});	
			
			var onlyMyPedals = helpers.where(thisBoard.pedals, function(pedal) {
				return otherBoardPedalIds.indexOf(pedal.id) === -1; //Where the other board does not contain this pedal
			});
			
			return new classes.PedalBoard(thisBoard.Name, onlyMyPedals);
        };
    
        //Returns the total cost of all of the pedals on this pedalboard
        this.TotalCost = function() {
            var total = 0;
            helpers.forEach(thisBoard.pedals, function(pedal) {
               total += pedal.price;
            });
            return total;
        };
	};
		
	function getPedals(pedalContainerData){
		var pedals = [];
		helpers.forEach(pedalContainerData.pedals, function (pedalData) {
			var pedal;
			
			//Create a pedal of correct class
			if (pedalData.identifier === 2)//Is a pedal
				pedal = new classes.Pedal(pedalData);
			else if (pedalData.identifier === 1) {//This is a pedal line
				pedalData.fullName = (pedalContainerData.fullName || pedalContainerData.name) + " " + pedalData.name;
				pedal = new classes.PedalLine(pedalData);
			}
			else //OH NO! This is a pedal brand!
				throw "Nothing may contain pedal brands. They are the top level. Failed on container id = " + pedalContainerData.id;
			
			//Prepend the container name to the full name
			pedal.fullName = (pedalContainerData.fullName || pedalContainerData.name) + " " + pedal.fullName;
			pedals.push(pedal);
		});
		return pedals;
	}
		
	//Same as a PedalBrand, but can be contained by a brand.
	classes.PedalLine = function (pedalLineData) {
		for (var key in pedalLineData) {
			if (key === "pedals")
				this[key] = getPedals(pedalLineData);
			else
				this[key] = pedalLineData[key];
		}
	};
		
	classes.PedalBrand = function(pedalBrandData) {
		for (var key in pedalBrandData) {
			if (key === "pedals")
				this[key] = getPedals(pedalBrandData);
			else
				this[key] = pedalBrandData[key];
		}
	};
		
	classes.Pedal = function(pedalData) {
		for (var key in pedalData)
			this[key] = pedalData[key];
		
		//This will be appended to by parent containers
		this.fullName = this.name;
	};
		
	//I may not use this.
	classes.PedalType = function(pedalTypeData) {
	this.name = pedalTypeData.name;
		this.id = pedalTypeData.id;
	};

	return classes;
});