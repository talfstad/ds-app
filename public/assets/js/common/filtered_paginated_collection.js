//taken from david sulc's example at: 
//https://github.com/davidsulc/structuring-backbone-with-requirejs-and-marionette

define(["app"], function(Moonlander){
  Moonlander.module("Entities", function(Entities, Moonlander, Backbone, Marionette, $, _){
    Entities.FilteredPaginatedCollection = function(options){
      var original = options.collection;

      var filtered = new original.constructor();
      filtered.add(original.models);
      filtered.filterFunction = options.filterFunction;

      filtered.state = {
        paginated: true,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
      };

      filtered.currentFilteredCollection = [];


      var applyFilter = function(filterCriterion, filterStrategy, collection){
        var collection = collection || original;
        var criterion;
        if(filterStrategy == "filter"){
          criterion = filterCriterion.trim();
        }
        else{
          criterion = filterCriterion;
        }

        var items = [];
        if(criterion){
          
          filtered.state.currentFilter = filterCriterion;

          if(filterStrategy == "filter"){
            if( ! filtered.filterFunction){
              throw("Attempted to use 'filter' function, but none was defined");
            }
            var filterFunction = filtered.filterFunction(criterion);
            items = collection.filter(filterFunction);
          }
          else{
            items = collection.where(criterion);
          }
        }
        else{
          items = collection.models;
        }

        // store current criterion
        filtered._currentCriterion = criterion;


        //where we paginate and return the first page
        filtered.currentFilteredCollection = items;
        if(filtered.state.paginated) {
          return filtered.paginate(items);
        } else {
          return items;
        }
      };

      filtered.filter = function(filterCriterion){
        filtered._currentFilter = "filter";
        var items = applyFilter(filterCriterion, "filter");

        // reset the filtered collection with the new items
        filtered.reset(items);
        return filtered;
      };

      filtered.where = function(filterCriterion){
        filtered._currentFilter = "where";
        var items = applyFilter(filterCriterion, "where");

        // reset the filtered collection with the new items
        filtered.reset(items);
        return filtered;
      };

      /////
      //pageination stuff starts
      /////
      filtered.paginate = function(items, pageToReturn){

        var pageSize = filtered.state.pageSize;
        filtered.state.totalPages = Math.floor(items.length / pageSize);
        if(items.length % pageSize > 0) {
          filtered.state.totalPages = Math.floor(items.length / pageSize) + 1;
        }

        var startingPoint = 0;
        if(pageToReturn) {
          startingPoint = (pageToReturn-1)*pageSize;
        }
        
        var currentPage = items.slice(startingPoint, startingPoint + pageSize);

        return currentPage;
      };

      filtered.setPageSize = function(pageSize) {
        if(pageSize >= 1) {
          filtered.state.pageSize = pageSize;
          var items = filtered.paginate(filtered.currentFilteredCollection);
          filtered.reset(items);
          return filtered;
        } else {
          throw "trying to set pagesize that is invalid";
        }
      };

      filtered.getNextPage = function() {
        
        if(filtered.state.totalPages >= (filtered.state.currentPage + 1)) {
          filtered.state.currentPage++;
          var items = filtered.paginate(filtered.currentFilteredCollection, filtered.state.currentPage);
          filtered.reset(items);
          return filtered;

        } else {
          throw "No more pages!";
        }
      };

      filtered.getPreviousPage = function() {
        if(0 > (filtered.state.currentPage - 1)) {
          filtered.state.currentPage--;
          var items = filtered.paginate(filtered.currentFilteredCollection, filtered.state.currentPage);
          filtered.reset(items);
          return filtered;

        } else {
          throw "No negative pages!";
        }
      };

      filtered.getFirstPage = function() {

      };

      filtered.getLastPage = function() {

      };


      filtered.sortFiltered = function(){
        //set original data
        filtered.set(filtered.currentFilteredCollection);
        filtered.sort();
        filtered.currentFilteredCollection = filtered.models;
        var items = filtered.paginate(filtered.currentFilteredCollection);

        filtered.reset(items);
        return filtered;
      };


      /////

      // when the original collection is reset,
      // the filtered collection will re-filter itself
      // and end up with the new filtered result set
      original.on("reset", function(){
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
      original.on("add", function(models){
        var coll = new original.constructor();
        coll.add(models);
        var items = applyFilter(filtered._currentCriterion, filtered._currentFilter, coll);
        filtered.add(items);
      });

      return filtered;
    };
  });

  return Moonlander.Entities.FilteredPaginatedCollection;
});
