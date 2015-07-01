define([ "boardDiffEngine", "pedalBoardClasses" ], function (boardDiffEngine, classes) {
	describe("boardDiffEngine", function () {
		describe("GetUniquePedals", function () {
			it("should throw an exception if one or both of the boards are not instances of the PedalBoard class", function () {
				var testMain = new classes.PedalBoard("Main");
				var testOther = new classes.PedalBoard("Other");
				
				expect(function () { 
					boardDiffEngine.GetUniquePedals();						
				}).toThrowError(TypeError);
				
				expect(function () { 
					boardDiffEngine.GetUniquePedals(testMain); 			
				}).toThrowError(TypeError);
				
				expect(function () { 
					boardDiffEngine.GetUniquePedals({}, testOther);		
				}).toThrowError(TypeError);
				
				expect(function () {
					boardDiffEngine.GetUniquePedals({}, {});						
				}).toThrowError(TypeError);
				
				expect(function () {
					boardDiffEngine.GetUniquePedals([], []);						
				}).toThrowError(TypeError);
				
				expect(function () {
					boardDiffEngine.GetUniquePedals({ pedals: [], Name: ""  }, testOther);						
				}).toThrowError(TypeError);
				
				expect(function () {
					boardDiffEngine.GetUniquePedals(testMain, { pedals: [], Name: ""  });						
				}).toThrowError(TypeError);
				
				expect(function () {
					boardDiffEngine.GetUniquePedals({ pedals: [], Name: ""  }, { pedals: [], Name: "" });						
				}).toThrowError(TypeError);
				
				/* but throw no exception if both are valid boards */
				expect(function () {
						boardDiffEngine.GetUniquePedals(testMain, testOther);	
				}).not.toThrowError(TypeError);
			});
			
			it("should return all of the pedals on \"main\" but not on \"other\" and not vice versa", function () {
				var dummyPedal = {
					name: "Brigadier",
					color: "#63843D",
					price: 299,
					type: 2,
					identifier: 2,
					id: 32,
				};
				
				var dummyPedal2 = {
					name: "Lex Rotary",
					color: "#8E5B48",
					price: 299,
					type: 3,
					identifier: 2,
					id: 33,
				};
				
				var testMain = new classes.PedalBoard("Main", [dummyPedal, dummyPedal]);
				var testOther = new classes.PedalBoard("Other", [dummyPedal2, dummyPedal]);
				
				expect(boardDiffEngine.GetUniquePedals(testMain, testOther)).toEqual([]);
				expect(boardDiffEngine.GetUniquePedals(testOther, testMain)).toEqual([dummyPedal2]);
			});
		});
	});
});