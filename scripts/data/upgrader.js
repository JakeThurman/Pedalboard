define(["pedalBoardStorage"], function (storage) {

	"use strict";
	
	var NO_VERSION_NUM = -1;
	var currentVersion = 1;
	
	/* 
	 * Maps versions to upgrade script files
	 * 
	 * require([upgradeScriptPaths[versionToUpgradeTo]], function (script) {
	 *    var upgradedData = script.upgrade(pedalboardStorage.Load());
	 *    ...
	 * });
	 */
	var upgradeScriptPaths = [
		"", /* Zero is not a version number */
	];
	
	var methods = {};
	
	/* Calls all scripts needed to finish upgrading */
	function callNextScript(versionToUpgradeTo, data) {
	
		require([upgradeScriptPaths[versionToUpgradeTo]], function (script) { 
			var output = script.upgrade(data); 
			
			versionToUpgradeTo++;
			
			if (versionToUpgradeTo < currentVersion)
				callNextScript(versionToUpgradeTo, output);
			else
				storage.Save(output);
		});
		
	}
	
	/*
	 * Upgrades the stored pedalboard data to the current version
	 */
	methods.upgrade = function () {
		
		var dataVersion = storage.getDataVersion() || NO_VERSION_NUM;
		
		if (dataVersion > currentVersion)
			throw new Error("Data version us higher than the current version.");
		
		/* If there is no recorded version number, set it to this version */
		if (dataVersion === NO_VERSION_NUM)
			storage.setDataVersion(currentVersion);
		
		/* We don't need to do anything because the data is either up to date */
		if (dataVersion === currentVersion || dataVersion === NO_VERSION_NUM)
			return;
		
		callNextScript(dataVersion, storage.Load());
		
		storage.setDataVersion(currentVersion);
		
	};
	
	return methods;

});