define(function () {
	//PedalType Parser,
	// Pedal.identifier is an enum
	// 0 = board,
	// 1 = line,
	// 2 = pedal,

	var methods = {};
	
	methods.get = function () {
		var values = {};
		
		values.PedalTypes: [{ 
				name: "Reverb",
				id: 1,
			},
			{
				name: "Delay",
				id: 2,
			},
			{
				name: "Modulation",
				id: 3,
			},	
			{
				name: "Compression",
				id: 4,
			},	
			{
				name: "Power",
				id: 5,
			},	
			{
				name: "Dirt",
				id: 6,
			},
			{
				name: "Tuning",
				id: 7,
			},	
			{
				name: "Expression",
				id: 8,
			},	
			{
				name: "Looper",
				id: 9,
			}];
		
		values.Pedals = [{
				name: "TC Electronics",
				identifier: 0,
				id: 1,
				pedals: [{
					name: "Hall Of Fame",
					identifier: 1,
					id : 2,
					pedals: [{
						name: "(Mini)",
						id: 1,
						identifier: 2,
						price: 99.99,
						type: 1,
					}]
				},
				{
					name: "ND-1 Nova Delay",
					id: 2,
					price: 169.99,
					identifier: 2,
					type: 2, 
				},
				{
					name: "Ditto Looper",
					identifier: 2,
					price: 99.99,
					type: 9,
					id: 3,
				}]
			},
			{
				name: "Boss",
				identifier: 0,
				id: 3,
				pedals: [{
					name: "CH1 Chorus", 
					price: 99,
					identifier: 2,
					type: 3,
					id: 4,
				}]
			},
			{
				name: "Snark",
				identifier: 0,
				id: 4,
				pedals: [{
					name: "SN10 Pedal Tuner",
					price: 32.69,
					type: 7,
					identifier: 2,
					id: 5,
				}]
			},
			{
				name: "Dunlop",
				identifier: 0,
				id: 5,
				pedals: [{
					name: "Crybaby Wah",
					price: 79.99,
					type: 8,
					identifier: 2,
					id: 6
				}]
			},
			{
				name: "Ernie Ball",
				identifier: 0,
				id: 6,
				pedals: [{
					name: "Volume Pedal JR",
					price: 67.65,
					type: 8,
					identifier: 2,
					id: 7,
				}]
			},
			{
				name: "Strymon",
				identifier: 0,
				id: 7,
				pedals: [{
					name: "Blue Sky",
					price: 299,
					type: 1,
					identifier: 2,
					id: 8,
				},
				{
					name: "Mobius",
					price: 449,
					type: 3,
					identifier: 2,
					id: 9,
				}]
			},
			{
				name: "Foxpedal",
				identifier: 0,
				id: 8,
				pedals: [{
					name: "Kingdom Transparent Overdrive",
					price: 159,
					type: 6,
					identifier: 2,
					id: 10,
				},
				{
					name: "Refinery",
					price: 169,
					type: 4,
					identifier: 2,
					id: 11,
				}]
			},
			{
				name: "Walrus Audio",
				identifier: 0,
				id: 9,
				pedals: [{
					name: "Deep Six",
					type: 4,
					price: 199,
					identifier: 2,
					id: 12
				}]
			},
			{
				name: "TRex",
				identifier: 0,
				id: 10,
				pedals: [{
					name: "Fuel Tank",
					identifier: 1,
					id: 11,
					pedals: [{
						name: "Chameleon",
						price: 149, 
						type: 5,
						identifier: 2,
						id: 13,
					},
					{
						name: "Jr.",
						price: 105,
						type: 5,
						identifier: 2,
						id: 14,
					}]
				}]
			},
			{
				name: "Electo-Harmonix",
				identifier: 0,
				id: 12,
				pedals: [{
					name: "Soul Food Overdrive",
					price: 78.20,
					type: 6,
					identifier: 2,
					id: 15,
				}]
			},
			{
				name: "Ibenez",
				identifier: 0,
				id: 13,
				pedals: [{
					name: "Tube Screamer",
					price: 99.99,
					type: 6,
					identifier: 2,
					id: 16,
				}]
			},
			{
				name: "Deltalab",
				identifier: 0,
				id: 14,
				pedals: [{
					name: "RD1 Rock Distortion",
					price: 24.99,
					type: 6,
					id: 17,
					identifier: 2,
				}]
			},
			{
				name: "Fulltone",
				identifier: 0,
				id: 15,
				pedals: [{
					name: "OCD - Obsesive Compulsive Drive",
					color: "white",
					price: 127.20,
					type: 6,
					identifier: 2,
					id: 18,
				}]
			}];
			
		return values;
	};
	
	return methods;
});