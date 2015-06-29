define([ "reportTypes", "reportDataHelpers", "domReady!" ], function (reportTypes, reportDataHelpers) {
	var methods = {};
	
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.maintainAspectRatio = false;
	
	methods.report = function (manager, boardId, type) {
				
		/* set up the data */		
		var data;
		
		if (type.id === reportTypes.price.id)
			data = reportDataHelpers.getPriceData(manager.GetBoard(boardId).data.pedals);
		else if (type.id == reportTypes.pedalType.id)
			data = reportDataHelpers.getPriceData(manager.GetBoard(boardId).data.pedals);
		else if (type.id == reportTypes.color.id)
			data = reportDataHelpers.getPriceData(manager.GetBoard(boardId).data.pedals);
		else
			throw new Error("Type param is not valid or not implemented!")
		
		/* set up the display */
		reportDataHelpers.chart(data);
	};
	
	return methods;
});