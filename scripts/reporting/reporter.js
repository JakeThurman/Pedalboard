define([ "Chart", "jquery", "reportTypes", "helperMethods", "domReady!" ], function (Chart, $, reportTypes, helpers) {
	var methods = {};
	
	methods.report = function (manager, boardId, type, compareBoardId) {
		Chart.defaults.global.responsive = true;
		Chart.defaults.global.maintainAspectRatio = false;
		
		/* set up the data */
		var data = [];
		
		if (type.id === reportTypes.price.id) {
			helpers.forEach(manager.GetBoard(boardId).data.pedals, function (pedal) {
				data.push({
					value: pedal.price,
					color:"#F7464A",
					highlight: "#FF5A5E",
					label: pedal.name
				});
			});
		}
		
		/* set up the display */
		var canvas = document.createElement("canvas");
		canvas.className = "report";
		
		var reportContainer = $("<div>", { "class": "above-screen-block report-container" })
			.append(canvas)
			.appendTo(document.body);
		
		var chart;
		var blocker = $("<div>", { "class": "screen-block" })
			.appendTo(document.body)
			.add(canvas).click(function () {
				blocker.add(reportContainer).remove();
				chart.destroy();
			});
		
		chart = new Chart(canvas.getContext("2d")).Doughnut(data);
	};
	
	return methods;
});