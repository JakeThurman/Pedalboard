define([ "changeLogger", "changeTypes", "objectTypes" ], function ( changeLogger, changeTypes, objectTypes ) {	
	describe("data/changeLogger.js", function () {
		var logger;
		var log;
		
		beforeEach(function () {
			logger = changeLogger.create();
			
			log = function (desc) {
				logger.log(desc, -1, -1, -1);
			};
		});
		
	    describe("log", function () {
		    it("should log changes", function () {
				logger.log("a change was made", changeTypes.addPedal, -1, objectTypes.pedalboard);
				expect(logger.changes.length).toEqual(1);
			});
			
			it("should throw an exception if no description is provided", function () {
				var thrower = function () {
					logger.log();
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @objType is not valid", function () {
				var thrower = function () {
					logger.log("test", -1, -1, "test");
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType is not valid", function () {
				var thrower = function () {
					logger.log("test", "test", -1, -1);
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if object Type is not undefined", function () {
				var thrower = function () {
					logger.log("test", 0, -1, void(0));
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType is not undefined", function () {
				var thrower = function () {
					logger.log("test", void(0), -1, -1);
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if @changeType and beyond are mission", function () {
				var thrower = function () {
					logger.log("test");
				};
				expect(thrower).toThrow();
			});
		});
		
		describe("batch", function () {
			it("should log changes all into one batch", function () {
				logger.batch("a test change", function () {
					log("a change was made");
					log("another change was made");					
				});
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should be able to handle batches and changes at the same level", function () {
				logger.batch("a test change", function () {
					log("a change was made");
					log("another change was made");					
				});
				log("top level change");
				
				expect(logger.changes.length).toEqual(2);
				expect(logger.changes[0].changes.length).toEqual(2);
			});
			
			it("should log changes into sub batches", function () {
				logger.batch("top batch", function () {
					logger.batch("a test change", function () {
						log("a change was made");
						log("another change was made");					
					});
					log("logged changes in a batch");
				});
				
				expect(logger.changes.length).toEqual(1);
				expect(logger.changes[0].changes.length).toEqual(2);
				expect(logger.changes[0].changes[0].changes.length).toEqual(2);
			});
			
			it("should not throw an exception if no batch name is provided", function () {
				var hit = false;
				var notThrower = function () {
					logger.batch(function () {
						log("something");
						hit = true;
					});
				};
				expect(notThrower).not.toThrow();
				expect(hit).toBe(true);
			});
			
			it("should do nothing if no function is provided", function () {
				expect(logger.batch("name")).toBeUndefined();
			});
		});
		
		describe("dontLog", function () {
		    it("should ignore all changes logged inside of a dontLog function", function () {
				logger.dontLog(function () {
					logger.batch("a test change", function () {
						log("a change was made");
						log("another change was made");					
					});
					
					log("an outside the batch change was made");
				});
				expect(logger.changes.length).toEqual(0);
			});
			
			it("should throw an exception if func is not a function", function () {
				var thrower = function () {
					logger.dontLog('');
				};
				expect(thrower).toThrow();
			});
			
			it("should throw an exception if func is not passed in", function () {
				var thrower = function () {
					logger.dontLog();
				};
				expect(thrower).toThrow();
			});
			
			it("should allow for sub-functions to call dontLog as well without causing the enabled flag to get reset early", function () {
				logger.dontLog(function () {
					log("top");
					logger.dontLog(function () {
						log("inner");
					});
				})
				
				expect(logger.changes.length).toEqual(0);
			});
		});
		
		describe("create", function () {
		    it("should throw an exception if @initialChanges is not an array", function () {
				var thrower = function () {
					changeLogger.create("");
				};
				expect(thrower).toThrow();
			});
		});
	});
});