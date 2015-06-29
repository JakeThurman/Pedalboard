define([ "reportTypes", "reportDataHelpers", "boardDiffEngine", "domReady!" ], function (reportTypes, reportDataHelpers, boardDiffEngine) {
	var methods = {};
	
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
		
	methods.compare = function (manager, boardId, type, compareBoardId) {
		/* get the unique pedals of each board to show the reports for */
		var a = manager.GetBoard(boardId).data;
		var b = manager.GetBoard(compareBoardId).data;
		
		var aMinusB = boardDiffEngine.GetUniquePedals(a, b); 
		var bMinusA = boardDiffEngine.GetUniquePedals(b, a);
		
		/* set up the data */		
		var aMinusBData;
		var bMinusAData;
		
		if (type.id === reportTypes.price.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.diff.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.pedalType.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else if (type.id == reportTypes.color.id) {
			aMinusBData = reportDataHelpers.getPriceData(aMinusB);
			bMinusAData = reportDataHelpers.getPriceData(bMinusA);
		}
		else
			throw new Error("Type param is not valid or not implemented!")
		
		/* set up the display */
		reportDataHelpers.chart(aMinusBData, "left-side");
		reportDataHelpers.chart(aMinusBData, "right-side");
	};
	
	return methods;
});