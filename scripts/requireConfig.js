requirejs.config({
	baseUrl: "scripts",
	paths: {
			/* Libraries */
			"domReady":                      "lib/domReady",
			"jquery":                        "lib/jquery",
			"jquery-ui":                     "lib/jquery-ui",
			"Chart":                         "lib/Chart",
			"moment":                        "lib/moment",
			
			/* Core */
			"helperMethods":                 "core/helperMethods",
			"textResources":				 "core/textResources",
			"stringReplacer":                "core/stringReplacer",
			
			/* UI Core */
			"_Popup":                        "ui-core/Popup",
			"_OptionMenu":                   "ui-core/OptionMenu",
			
			/* UI */
			"addPedalMenu":                  "ui/addPedalMenu",
			"mainPageMenuHandler":           "ui/mainPageMenuHandler",
			"pedalboardPopup":               "ui/pedalboardPopup",
			"pedalboardPopupOptionsHandler": "ui/pedalboardPopupOptionsHandler",
			"pedalRenderer":                 "ui/pedalRenderer",
			"historyPopup":                  "ui/historyPopup",
			"reportTypeMenu":                "ui/reportTypeMenu",
			"compareToMenu":                 "ui/compareToMenu", 
			
			/* Data */
			"pedalBoardClasses":             "data/pedalBoardClasses",
			"pedalBoardManager":             "data/pedalBoardManager",
			"pedalBoardStorage":             "data/pedalBoardStorage",
			"pedalDataAccess":               "data/pedalDataAccess",
			"pedalsGetter":                  "data/pedalsGetter",
			"changeLogger":                  "data/changeLogger",
			
			/*reporting*/
			"reportTypes":                   "reporting/reportTypes",
	},
	config: {
		moment: {
			noGlobal: true
        }
	}
});

require([ "jquery" ], function ($) {
    $.noConflict();
});