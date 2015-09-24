define([ "textResources", "changeTypes", "objectTypes" ], function ( resources, changeTypes, objectTypes ) {
	return {
		boards: [{
			data: {
				Name: resources.defaultPedalBoardName,
				pedals: [],
			},
			clientRect: {
				left: "10px",
				top: "49px",
				width: "509px"
			},
		}],
		changes: [{
			changeType: changeTypes.add,
			objId: "tutorial",
			objType: objectTypes.tutorial,
			id: "c--1",
			timeStamp: new Date(),
		}],
	}
});