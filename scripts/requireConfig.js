requirejs.config({
		baseUrl: "scripts",
		paths: {
				/* Libraries */
		    "jquery":                        "lib/jquery",
				"jquery-ui":                     "lib/jquery-ui",
				"Chart":                         "lib/Chart.min",
				
				/* Core */
				"helperMethods":                 "core/helperMethods",
				"textResources":								 "core/textResources",
				
				/* UI Core */
				"_Popup":                        "ui-core/_Popup",
				"_SavePopup":                    "ui-core/_SavePopup",
				"_OptionMenu":                  "ui-core/_OptionMenu",
				
				/* UI */
				"addPedalPopup":                 "ui/addPedalPopup",
				"mainPageMenuHandler":           "ui/mainPageMenuHandler",
				"pedalboardPopup":               "ui/pedalboardPopup",
				"pedalboardPopupOptionsHandler": "ui/pedalboardPopupOptionsHandler",
				"pedalRenderer":                 "ui/pedalRenderer",
				
				/* Data */
				"pedalBoardClasses":             "data/pedalBoardClasses",
				"pedalBoardManager":             "data/pedalBoardManager",
				"pedalBoardStorage":             "data/pedalBoardStorage",
				"pedalDataAccess":               "data/pedalDataAccess",
				"pedalsGetter":                  "data/pedalsGetter",
		},
});

require([ "setupPedalboardPage", "jquery", "Chart" ], function (setupPedalboardPage, $, Chart) {
    /* No non-amd $ dependencies! yay */
    $.noConflict();
		
		/* No non-amd chart dependencies either! */
		Chart.noConflict();
		
		setupPedalboardPage.setup();
});