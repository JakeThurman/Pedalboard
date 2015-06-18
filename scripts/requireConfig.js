requirejs.config({
		baseUrl: "scripts",
});

//No non-amd $ dependencies! yay
require(["jquery"], function ($) {
    $.noConflict();
});