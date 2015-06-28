define(function () {
	/* the class */
	function ReportType(id, resource, forCompare, forReport) {
		this.id = id;
		this.resource = resource;
		this.forCompare = forCompare;
		this.forReport = forReport;
	}
	
	/* instances */
	return {
		price: new ReportType("price", "reportType_Price", true, true),
		diff: new ReportType("diff", "reportType_Diff", true, false),
		pedalType: new ReportType("pedalType", "reportType_PedalType", true, true),
		color: new ReportType("color", "reportType_Color", true, true),
	};
});