define("changeTypes", {
	addPedalboard    : 0,
	renamePedalboard : 1,
	addBoard         : 2,
	renamedBoard     : 3,
	deleteBoard      : 4,
	deleteAllBoards  : 5,
	addPedal         : 6,
	removedPedal     : 7,
	clearedBoard     : 8,
	resizeBoard      : 9,
	moveBoard        : 10,
	movePedalUp      : 11,
	movePedalDown    : 12,
	movePedalToTop   : 13,
	movePedalToBottom: 14,
});

define("objectTypes", {
	pedalboard       : 0,
	pedal            : 1,
});

define("batchTypes", {
	firstLoad        : 0,
	clearBoard       : 1,
	deleteAll        : 2,
});