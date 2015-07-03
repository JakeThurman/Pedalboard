define(function () {
	/* the class */
	function ReportType(id, resource, forCompare, forReport, options) {
		this.id = id;
		this.resource = resource;
		this.forCompare = forCompare;
		this.forReport = forReport;
		this.options = options;
	}
	
	/* instances */
	return {
		price: new ReportType("price", "reportType_Price", true, true, {
			tooltipTemplate: "<%= label %>: $<%= value %>"
		}),
		pedalType: new ReportType("pedalType", "reportType_PedalType", true, true, {}),
		color: new ReportType("color", "reportType_Color", true, true, {}),
	};
});