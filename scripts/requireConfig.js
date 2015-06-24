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
				"_Popup":                        "ui-core/Popup",
				"_SavePopup":                    "ui-core/SavePopup",
				"_OptionMenu":                   "ui-core/OptionMenu",
				
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
				"changeLogger":                  "data/changeLogger",
		}
});

require([ "jquery" ], function ($) {
    $.noConflict();
});