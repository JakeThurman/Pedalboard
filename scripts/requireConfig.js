requirejs.config({
		baseUrl: "scripts",
		paths: {
				/* Libraries */
				"domReady":                      "lib/domReady",
				"jquery":                        "lib/jquery",
				"jquery-ui":                     "lib/jquery-ui",
				"Chart":                         "lib/Chart",
				
				/* Core */
				"helperMethods":                 "core/helperMethods",
				"textResources":				 "core/textResources",
				"stringReplacer":                "core/stringReplacer",
				
				/* UI Core */
				"_Popup":                        "ui-core/_Popup",
				"_SavePopup":                    "ui-core/_SavePopup",
				"_OptionMenu":                   "ui-core/_OptionMenu",
				
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
		}
});

require([ "jquery" ], function ($) {
    $.noConflict();
});