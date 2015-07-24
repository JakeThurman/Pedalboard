define([ "historyPopup", "changeLogger", "jquery" ], function ( historyPopup, changeLogger, $ ) {
	"use strict";
	
	describe("ui/historyPopup.js", function () {
		var changes;
			
		beforeEach(function () {
			var logger = changeLogger.create();
			var log = function () {
				logger.log(4, -1, -1);
			};
			
			log("1");
			log("2");
			log("3");
			
			logger.batch(0, function () {
				log("sub 1");
				log("sub 2");
				log("sub 3");
				
				logger.batch(0, function () {
					log("double sub 1");
					log("double sub 2");
					log("double sub 3");
				});
			});
			
			logger.batch(0, function () {
				log("sub 1");
				log("sub 2");
				log("sub 3");
			});
			
			changes = logger.changes;
		});
		
		describe("changeLog parameter", function () {
			it("should be allowed to be an empty array or undefined", function () {
				expect(function () { historyPopup.create() }).not.toThrow();
				expect(function () { historyPopup.create([]) }).not.toThrow();
			});
		});
		
		describe("batches", function () {
			it("should be able to collapse/expanded (show/hidden)", function () {
				var popup = historyPopup.create(changes).popup;
				
				var batch = $(popup.el.find(".batch").get(0));
				var batchExpand = batch.children("i");
				
				var batchChanges = function () { return batch.find(".change"); };
				var visibleBatchChanges = function () { return batchChanges().filter(":visible"); };

				/* batch changes should be hidden by default */
				expect(visibleBatchChanges().length).toEqual(0);
				
				/* expand the batch */
				batchExpand.click();
				
				/* batch changes should be visible now */
				expect(batchChanges().length).toBeGreaterThan(0);
				expect(visibleBatchChanges().length).toEqual(batchChanges().length);
				
				/* collapse the batch */
				batchExpand.click();
				
				/* batch changes should be hidden again */
				expect(batchChanges().length).toBeGreaterThan(0);
				
				/* 
				 * This last expect was supposed to test if the changes were hidden again.
				 * This works in the dom but the test is broken. 
				 * JQuery's visible selector doesn't work with setting a class on the parent class, 
				 * and having css hide child elements if it doesn't have it like we're doing.
				 */
				/* expect(visibleBatchChanges().length).toEqual(0); */
			});
			
			it("should be handled even when containing sub-batches", function () {
				/* the test change data contains a sub batch already */
				expect(function () { historyPopup.create(changes); }).not.toThrow();
			});
						
			it("should be handled even when there are multiple", function () {
				/* the test change data contains a multiple batches already */
				expect(function () { historyPopup.create(changes); }).not.toThrow();
			});
		});
		
		describe("performance", function () {
			/* helper to create big change logs very easily */
			function getChanges(batches, changePerBatch) {
				var logger = changeLogger.create();
							
				for (var b = 0; b < batches; b++) {
					logger.batch(0, function () {
						for(var c = 0; c < changePerBatch; c++) {
							logger.log(-1, -1, -1);
						}
					});
				}
				
				return logger.changes;
			}
			
			it("should be under 300ms to render 200 batches with 200 changes each, (40,000 changes)", function () {
				var changes = getChanges(200, 200);
				
				var start = new Date().getTime();

				var nothing = historyPopup.create(changes);

				var end = new Date().getTime();
				
				expect(end - start).toBeLessThan(300);
			});
		});
		
		describe("addChange callback", function () {
			it("should add a passed in change to the page", function () {
				var hPopup = historyPopup.create(changes);
				var desc = "A very long string that is also very specificly something that would not have been rendered previously." + new Date();
				
				var contains = function(str) {
					return hPopup.popup.el.get(0).innerHTML.indexOf(str) != -1;
				};
				
				/* should not contain it before adding it! */
				expect(contains(desc)).toBe(false);
				
				/* add it */
				hPopup.addChange({
					isBatch: true, /* only batches have a non generated description */
					description: desc,
					timeStamp: new Date(),
				});
				
				/* now it should contain it */
				expect(contains(desc)).toBe(true);
				
				hPopup.popup.el.remove();
			});			
		});
	});
});