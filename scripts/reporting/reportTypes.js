define(function () {
	/* the class */
	function ReportType(id, resource, forCompare, forReport, totalTemplate, options) {
		this.id = id;
		this.resource = resource;
		this.forCompare = forCompare;
		this.forReport = forReport;
		this.options = options;
		this.totalTemplate = totalTemplate;
	}
	
	/* instances */
	return {
		price: new ReportType("price", "reportType_Price", true, true, 
			"${0}", { tooltipTemplate: "<%= label %>: $<%= value %>" }),
		pedalType: new ReportType("pedalType", "reportType_PedalType", true, true, 
			"{0} types"),
		color: new ReportType("color", "reportType_Color", true, true,
			"{0} colors"),
	};
});