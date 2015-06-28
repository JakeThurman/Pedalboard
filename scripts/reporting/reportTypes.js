define(function () {
	/* the class */
	function ReportType(id, forCompare, forReport) {
		this.id = id;
		this.forCompare = forCompare;
		this.forReport = forReport;
	}
	
	/* instances */
	return {
		price: new ReportType("price", true, true),
	};
});