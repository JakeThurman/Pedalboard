define({
	render: function (price) {
		"use strict";
		price = price / 100;
		
		/* If the number has no decimal places, render none, otherwise render two (standard money format) */
		var decimalPlaces = (price % 1) === 0 ? 0 : 2;
		
		return price.toFixed(decimalPlaces);
	}
});