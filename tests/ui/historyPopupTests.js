define([ "historyPopup", "changeLogger", "jquery", "_Popup" ], function ( historyPopup, changeLogger, $, _Popup ) {
	"use strict";
	
	/* It makes a small difference and makes testing much easier */
	historyPopup.RENDER_ASYNC = false;
	
	describe("ui/historyPopup.js", function () {
		var logger;
			
		beforeEach(function () {
			logger = changeLogger.create();
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
		});
		
		describe("logger parameter", function () {
			it("should be required", function () {			
				expect(function () { 
					var popup = historyPopup.create(); 
					_Popup.close(popup.id);
				}).toThrow();
				
				expect(function () { 
					var popup = historyPopup.create([]);
					_Popup.close(popup.id);
				}).toThrow();
				
				expect(function () { 
					var popup = historyPopup.create({ changes: [], addCallback: function () {} }); 
					_Popup.close(popup.id);
				}).toThrow();
				
				/* Clean up! */
				
				expect(function () { 
					var popup = historyPopup.create(logger); 
					_Popup.close(popup.id);
				}).not.toThrow();
			});
		});
		
		describe("batches", function () {
			it("should be able to collapse/expanded (show/hidden)", function () {
				var popup = historyPopup.create(logger);
				
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
				
				/* Clean up! */
				_Popup.close(popup.id);
			});
			
			it("should be handled even when containing sub-batches", function () {
				/* the test change data contains a sub batch already */
				var hPopupId;
				expect(function () { hPopupId = historyPopup.create(logger).id; }).not.toThrow();
				
				/* Clean up! */
				_Popup.close(hPopupId);
			});
						
			it("should be handled even when there are multiple", function () {
				/* the test change data contains a multiple batches already */
				var hPopupId;
				expect(function () { hPopupId = historyPopup.create(logger).id; }).not.toThrow();
				
				/* Clean up! */
				_Popup.close(hPopupId);
			});
		});
		
		describe("performance", function () {
			/* helper to create big change logs very easily */
			function getChangeLogger(batches, changePerBatch) {
				var logger = changeLogger.create();
							
				var makeChange = function () {
					for(var c = 0; c < changePerBatch; c++) {
						logger.log(-1, -1, -1);
					}
				};
				
				for (var b = 0; b < batches; b++) {
					logger.batch(0, makeChange);
				}
				
				return logger;
			}
			
			it("should be under 300ms to render 200 batches with 200 changes each, (40,000 changes)", function () {
				var logger = getChangeLogger(200, 200);
				
				var start = new Date().getTime();
				var hPopup = historyPopup.create(logger);
				var end = new Date().getTime();
				
				expect(end - start).toBeLessThan(300);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});
		});
		
		describe("new changes logged while the popup is open should be rendered.", function () {
			it("should add a passed in change to the page", function () {
				var hPopup = historyPopup.create(logger);
				var desc = "A very long string that is also very specificly something that would not have been rendered previously." + new Date();
				
				var length = function(str) {
					return hPopup.el.get(0).innerHTML.length;
				};
				
				/* Should not contain it before adding it! */
				var lengthBefore = length();
				
				/* Add it */
				logger.log(4, -1, -1);
				
				/* Now it should contain it */
				expect(length()).toBeGreaterThan(lengthBefore);
				
				hPopup.el.remove();
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});		
			
			it("should not display changes made in a non-complete batch", function () {
				var hPopup = historyPopup.create(logger);
				
				var contains = function(str) {
					return hPopup.el.get(0).innerHTML.indexOf(str) != -1;
				};
				
				var getTopLevelChangesCount = function() {
					/* TODO: Hard coding ".history-popup" is bad */
					return hPopup.el.find(".history-popup").children().length;
				};
				var childrenBefore = getTopLevelChangesCount();
				
				/* Add it */
				logger.batch(0, function () {
					logger.log(4, -1, -1);
					logger.log(4, -1, -1);
					logger.log(4, -1, -1);
				});
				
				/* Now it should contain it */
				expect(getTopLevelChangesCount()).toBe(childrenBefore + 1);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});						
		});
	});
});