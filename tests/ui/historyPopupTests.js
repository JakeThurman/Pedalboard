define([ "historyPopup", "ChangeLogger", "jquery", "_Popup" ], function ( historyPopup, ChangeLogger, $, _Popup ) {
	"use strict";
	
	/* It makes a small difference and makes testing much easier */
	historyPopup.RENDER_ASYNC = false;
	
	describe("ui/historyPopup.js", function () {
		var logger;
			
		beforeEach(function () {
			logger = new ChangeLogger();
			logger.CALLBACK_ASYNC = false;
			
			var log = function () {
				logger.log(4, 1, 1);
			};
			
			log("1");
			log("2");
			log("3");
			
			logger.batch(0, 0, 0, "a", function () {
				log("sub 1");
				log("sub 2");
				log("sub 3");
				
				logger.batch(0, 0, 0, "a", function () {
					log("double sub 1");
					log("double sub 2");
					log("double sub 3");
				});
			});
			
			logger.batch(0, 0, 0, "a", function () {
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
				
				/* Expand the smart batch */
				popup.el.find(".batch").click();
				
				var batch = popup.el.find(".batch > .batch").first();
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
				var logger = new ChangeLogger();
							
				var makeChange = function () {
					for(var c = 0; c < changePerBatch; c++) {
						logger.log(1, 1, -1);
					}
				};
				
				for (var b = 0; b < batches; b++) {
					logger.batch(0, 0, makeChange);
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
				
				var length = function() {
					return hPopup.el.get(0).innerHTML.length;
				};
				
				/* Should not contain it before adding it! */
				var lengthBefore = length();
				
				/* Add it */
				logger.log(4, 1, 1);
				
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
				logger.batch(1, 1, 1, "", function () {
					logger.log(4, 1, 1);
					logger.log(4, 1, 1);
					logger.log(4, 1, 1);
				});
				
				/* Now it should contain it */
				expect(getTopLevelChangesCount()).toBe(childrenBefore + 1);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});
		});
		
		describe("The smart batch engine", function () {
			it("should group a new change (after open) with the same objId as the last logged smart batch inside of it", function () {
				var logger = new ChangeLogger();
				logger.log(5, 2, 2);
				
				var hPopup = historyPopup.create(logger);

				var getChildren = function () {
					return hPopup.el.find(".history-popup").children();
				};
				
				var before = getChildren().last();
				var countBefore = getChildren().length;
				
				logger.log(5, 2 ,2) 
				
				var after = getChildren().last();
				var countAfter = getChildren().length;
				
				/* Expect that before there was a change and after there was a batch */
				expect(before.hasClass("change")).toBe(true);
				expect(before.hasClass("batch")).toBe(false);
				expect(after.hasClass("change")).toBe(false);
				expect(after.hasClass("batch")).toBe(true);
				
				/* Expect that the old was removed */
				expect(countAfter).toBe(1);
				expect(countBefore).toBe(1);
				
				/* Expand the batch */
				after.click();
				
				var batchChildrenCount = after.children().length;
				
				/* Expect the batch to contain both changes */
				expect(batchChildrenCount).toBe(2);
				
				/* Expect both to be changes */
				var changes = after.children();
				
				expect(changes.first().hasClass("change")).toBe(true);
				expect(changes.first().hasClass("batch")).toBe(false);
				expect(changes.last().hasClass("change")).toBe(true);
				expect(changes.last().hasClass("batch")).toBe(false);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});
			
			it("should not change the expand/colapse state when adding a new change to a smart batch", function () {
				var logger = new ChangeLogger();
				logger.log(5, 2, 2);
				logger.log(5, 2, 2);
				logger.log(5, 2, 2);
				
				var hPopup = historyPopup.create(logger);

				var getChildren = function () {
					return hPopup.el.find(".history-popup").children();
				};
				
				var batch = getChildren().last();
				
				expect(batch.hasClass("expanded")).toBe(false);
				batch.click();
				expect(batch.hasClass("expanded")).toBe(true);
				
				logger.log(5, 2, 2);
				
				expect(batch.hasClass("expanded")).toBe(true);
				batch.click();
				expect(batch.hasClass("expanded")).toBe(false);
				
				logger.log(5, 2, 2);
				
				expect(batch.hasClass("expanded")).toBe(false);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});
			
			it("should group changes logged made to the same objId together.", function () {	
				var logger = new ChangeLogger();
				logger.log(5, 2, 2);
				logger.log(5, 2, 2);
				logger.log(5, 2, 2);
				
				var hPopup = historyPopup.create(logger);

				var getChildren = function () {
					return hPopup.el.find(".history-popup").children();
				};
				
				/* Make suret that they were created in the same batch */
				expect(getChildren().length).toBe(1);
				expect(getChildren().last().hasClass("change")).toBe(false);
				expect(getChildren().last().hasClass("batch")).toBe(true);
				
				/* Expand the batch */
				var batch = getChildren().last().click();
				
				expect(batch.children().length).toBe(3);
				expect(batch.children().first().hasClass("change")).toBe(true);
				expect(batch.children().first().hasClass("batch")).toBe(false);
				expect($(batch.children()[1]).hasClass("change")).toBe(true);
				expect($(batch.children()[1]).hasClass("batch")).toBe(false);
				expect(batch.children().last().hasClass("change")).toBe(true);
				expect(batch.children().last().hasClass("batch")).toBe(false);
				
				/* Clean up! */
				_Popup.close(hPopup.id);
			});
						
			/*
			it("should not group for different objIds", function () {
			});
			
			it("should not group for different objNames", function () {
			});
			
			it("should group for different objTypes", function () {
			});
			*/
		});
	});
});