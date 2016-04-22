//taken from david sulc's example at: 
//https://github.com/davidsulc/structuring-backbone-with-requirejs-and-marionette

define(["app",
    "/assets/js/common/filtered_paginated/paginated_model.js"
  ],
  function(Moonlander, PaginatedModel) {
    Moonlander.module("Entities", function(Entities, Moonlander, Backbone, Marionette, $, _) {
      Entities.FilteredPaginatedCollection = function(options) {
        var original = options.collection;

        var filtered = new original.constructor();
        filtered.original = original;
        filtered.add(original.models);
        filtered.filterFunction = options.filterFunction;

        filtered.state = {
          paginated: options.paginated,
          currentPage: 1,
          pageSize: 10
        };


        if (filtered.state.paginated) {
          filtered.state.gui = new PaginatedModel();
          //init
          filtered.state.gui.set('current_page', 1);
          filtered.state.gui.set('num_pages', 1);



          filtered.state.gui.set('total_not_deployed', 0);
          filtered.state.gui.set('total_deploying', 0);
          filtered.state.gui.set('total', 0);
          filtered.state.gui.set('total_initializing', 0);
          filtered.state.gui.set('total_deleting', 0);
          filtered.state.gui.set('total_modified', 0);
        }
        filtered.state.currentFilter = "";

        filtered.currentFilteredCollection = [];

        var applyFilter = function(filterCriterion, filterStrategy, collection) {
          var collection = collection || original;
          var criterion;
          if (filterStrategy == "filter") {
            criterion = filterCriterion.trim();
          } else {
            criterion = filterCriterion;
          }

          var items = [];
          if (criterion) {

            filtered.state.currentFilter = filterCriterion;

            if (filterStrategy == "filter") {
              if (!filtered.filterFunction) {
                throw ("Attempted to use 'filter' function, but none was defined");
              }
              var filterFunction = filtered.filterFunction(criterion);
              items = collection.filter(filterFunction);
            } else {
              items = collection.where(criterion);
            }
          } else {
            items = collection.models;
          }

          // store current criterion
          filtered._currentCriterion = criterion;


          //where we paginate and return the first page
          filtered.currentFilteredCollection = items;
          if (filtered.state.paginated) {
            return filtered.paginate(items);
          } else {
            return items;
          }
        };

        var updateShowing = function(low, high, total) {
          if (total < high) {
            high = total;
          }
          if (total < low) {
            low = total;
          }
          filtered.state.gui.set('showing_low', low);
          filtered.state.gui.set('showing_high', high);
          filtered.state.gui.set('showing_total', total);
        };

        filtered.filter = function(filterCriterion) {
          filtered._currentFilter = "filter";
          var items = applyFilter(filterCriterion, "filter");

          // reset the filtered collection with the new items
          filtered.reset(items);
          return filtered;
        };

        filtered.where = function(filterCriterion) {
          filtered._currentFilter = "where";
          var items = applyFilter(filterCriterion, "where");

          // reset the filtered collection with the new items
          filtered.reset(items);
          return filtered;
        };

        filtered.resetWithOriginals = function(criterion) {
          criterion = "";
          var items = applyFilter(criterion, "filter");

          filtered.reset(items);
          return filtered;
        };

        filtered.showPageWithModel = function(model) {
          filtered.resetWithOriginals(filtered.state.currentFilter);
          //1. get page number that this model is on
          var pageSize = filtered.state.gui.get("page_size");
          var itemIndex = original.indexOf(model) + 1;
          //2. goto that page!
          var pageToGoto = Math.floor(itemIndex / pageSize) + 1
          filtered.gotoPage(pageToGoto);
        };

        /////
        //pageination stuff starts
        /////
        filtered.paginate = function(items, pageToReturn) {
          pageToReturn = pageToReturn || 1;

          filtered.state.gui.set('total_num_items', items.length);

          var pageSize = parseInt(filtered.state.pageSize);

          filtered.state.gui.set('page_size', pageSize);

          var totalPages = Math.floor(items.length / pageSize);
          if (items.length % pageSize > 0) {
            totalPages = Math.floor(items.length / pageSize) + 1;
          }

          var startingPoint = 0;
          if (pageToReturn) {
            startingPoint = (pageToReturn - 1) * pageSize;
          }

          var currentPage = items.slice(startingPoint, startingPoint + pageSize);


          filtered.state.gui.set('current_page', pageToReturn);
          filtered.state.gui.set('num_pages', totalPages);

          //update topbarModel with new figures
          var totalItemsCount = filtered.state.gui.get("total_num_items");
          //because filtering starts at page 1 again
          var newLowPageItemNum = 1;
          var newHighPageItemNum = filtered.state.gui.get("page_size");

          if (totalItemsCount < newHighPageItemNum) {
            newHighPageItemNum = totalItemsCount;
          }
          if (totalItemsCount < 1) {
            newLowPageItemNum = 0;
          }
          updateShowing(newLowPageItemNum, newHighPageItemNum, totalItemsCount);

          return currentPage;
        };

        filtered.updateTotals = function() {
          var notDeployedTotal = 0;
          var deployingTotal = 0;
          var totalLanders = 0;
          var initializing = 0;
          var deleting = 0;
          var modified = 0;
          //loop through all landers to count the totals
          original.each(function(model) {
            totalLanders++;
            var deployStatus = model.get("deploy_status");
            var modifiedAttr = model.get("modified");
            if (modifiedAttr) {
              modified++;
            } else {
              if (deployStatus === "not_deployed") {
                notDeployedTotal++;
              } else if (deployStatus === "deploying") {
                deployingTotal++;
              } else if (deployStatus === "initializing") {
                initializing++;
              } else if (deployStatus === "deleting") {
                deleting++;
              }
            }
          });
          filtered.state.gui.set("total_not_deployed", notDeployedTotal);
          filtered.state.gui.set("total_deploying", deployingTotal);
          filtered.state.gui.set("total", totalLanders);
          filtered.state.gui.set("total_initializing", initializing);
          filtered.state.gui.set("total_deleting", deleting);
          filtered.state.gui.set("total_modified", modified);
        }

        filtered.setPageSize = function(pageSize) {
          if (pageSize >= 1) {
            filtered.state.pageSize = pageSize;
            var items = filtered.paginate(filtered.currentFilteredCollection);

            var totalItemsCount = filtered.state.gui.get("total_num_items");

            updateShowing(1, pageSize, totalItemsCount);

            filtered.reset(items);
            return filtered;
          } else {
            throw "trying to set pagesize that is invalid";
          }
        };

        filtered.getFirstPage = function() {
          var items = filtered.paginate(filtered.currentFilteredCollection);
          filtered.state.gui.set('current_page', 1);

          var totalItemsCount = filtered.state.gui.get("total_num_items");

          updateShowing(1, filtered.state.gui.get('page_size'), totalItemsCount);

          filtered.reset(items);
          return filtered;
        };

        filtered.getLastPage = function() {
          var items = filtered.paginate(filtered.currentFilteredCollection, filtered.state.gui.get('num_pages'));
          filtered.state.gui.set('current_page', filtered.state.gui.get('num_pages'));

          var totalItemsCount = filtered.state.gui.get("total_num_items");

          var showingLow = (parseInt(filtered.state.gui.get('current_page')) * parseInt(filtered.state.gui.get('page_size'))) - parseInt(filtered.state.gui.get('page_size')) + 1;

          var totalItemsCount = filtered.state.gui.get("total_num_items");

          updateShowing(showingLow, totalItemsCount, totalItemsCount);

          filtered.reset(items);
          return filtered;
        };

        filtered.getNextPage = function() {
          var nextPage = filtered.state.gui.get('current_page') + 1;
          if (filtered.state.gui.get('num_pages') >= nextPage) {
            filtered.state.gui.set('current_page', nextPage);
            var items = filtered.paginate(filtered.currentFilteredCollection, nextPage);

            var showingLow = (parseInt(filtered.state.gui.get('current_page')) * parseInt(filtered.state.gui.get('page_size'))) - parseInt(filtered.state.gui.get('page_size')) + 1;
            var showingHigh = showingLow + parseInt(filtered.state.gui.get('page_size'));
            var totalItemsCount = filtered.state.gui.get("total_num_items");

            updateShowing(showingLow, showingHigh, totalItemsCount);

            filtered.reset(items);
            return filtered;

          } else {
            throw "No more pages!";
          }
        };

        filtered.getPreviousPage = function() {
          var previousPage = filtered.state.gui.get('current_page') - 1;
          if (0 < previousPage) {
            filtered.state.gui.set('current_page', previousPage);
            var items = filtered.paginate(filtered.currentFilteredCollection, previousPage);

            var showingLow = (parseInt(filtered.state.gui.get('current_page')) * parseInt(filtered.state.gui.get('page_size'))) - parseInt(filtered.state.gui.get('page_size')) + 1;
            if (previousPage < 2) {
              showingLow = 1;
            }

            var showingHigh = showingLow + parseInt(filtered.state.gui.get('page_size'));
            if (previousPage < 2) {
              showingHigh = filtered.state.gui.get('page_size');
            }
            var totalItemsCount = filtered.state.gui.get("total_num_items");

            updateShowing(showingLow, showingHigh, totalItemsCount);

            filtered.reset(items);
            return filtered;

          } else {
            throw "No negative pages!";
          }
        };

        filtered.gotoPage = function(page) {
          page = parseInt(page);
          filtered.state.gui.set('current_page', page);
          var items = filtered.paginate(filtered.currentFilteredCollection, page);

          var showingLow = (page * parseInt(filtered.state.gui.get('page_size'))) - parseInt(filtered.state.gui.get('page_size')) + 1;
          if (page < 2) {
            showingLow = 1;
          }

          var showingHigh = showingLow + parseInt(filtered.state.gui.get('page_size'));

          if (page < 2) {
            showingHigh = filtered.state.gui.get('page_size');
          }
          var totalItemsCount = filtered.state.gui.get("total_num_items");

          updateShowing(showingLow, showingHigh, totalItemsCount);

          filtered.reset(items);
          return filtered;
        };

        filtered.sortFiltered = function() {
          //set original data
          filtered.set(filtered.currentFilteredCollection);
          filtered.sort();

          original.set(filtered.currentFilteredCollection);
          original.sort();

          filtered.currentFilteredCollection = filtered.models;
          var items = filtered.paginate(filtered.currentFilteredCollection);

          filtered.reset(items);
          return filtered;
        };

        // when the original collection is reset,
        // the filtered collection will re-filter itself
        // and end up with the new filtered result set
        original.on("reset", function() {
          var items = applyFilter(filtered._currentCriterion, filtered._currentFilter);
          filtered.currentFilteredCollection = items;
          // reset the filtered collection with the new items
          filtered.reset(items);
        });

        // if the original collection gets models added to it:
        // 1. create a new collection
        // 2. filter it
        // 3. add the filtered models (i.e. the models that were added *and*
        //     match the filtering criterion) to the `filtered` collection
        original.on("add", function(models) {
          var coll = new original.constructor();
          coll.add(models);
          var items = applyFilter(filtered._currentCriterion, filtered._currentFilter, coll);

          filtered.add(items);
        });

        original.on("change:deploy_status", function() {
          filtered.updateTotals();
        });

        original.on("destroy", function(models) {

          if (filtered.state.paginated) {
            var currentPage = filtered.state.gui.get("current_page");
          }

          //1. filter to reset it
          filtered.filter(filtered.state.currentFilter);

          //2. set current page = to what it was before
          if (filtered.state.paginated) {
            if (currentPage <= filtered.state.gui.get("num_pages")) {
              filtered.gotoPage(currentPage);
            }
          }

        });

        filtered.on("add", function(models) {
          original.add(models);
        });

        return filtered;
      };
    });

    return Moonlander.Entities.FilteredPaginatedCollection;
  });
