define(["app",
        "/assets/js/apps/moonlander/landers/list/views/list_view.js",
        "/assets/js/apps/moonlander/landers/dao/lander_collection.js",
        "/assets/js/common/filtered_collection.js",
        "/assets/js/apps/moonlander/landers/list/views/list_layout_view.js"
], 
function(Moonlander, ListView, LanderCollection, FilteredCollection){
  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _){

    List.Controller = {

      showLanders: function(){
        //make layout for landers
        var landersListLayout = new List.Layout();
        landersListLayout.render();
       
        Moonlander.rootRegion.currentView.mainContentRegion.show(landersListLayout);

        //request landers collection
        var deferredLandersCollection = Moonlander.request("landers:landersCollection");
        
        $.when(deferredLandersCollection).done(function(landersCollection){

          var filteredLanderCollection = FilteredCollection({
            collection: landersCollection,
            filterFunction: function(filterCriterion){
              var criterion = filterCriterion.toLowerCase();
              return function(lander){
                if(lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
                  // || lander.get('lastName').toLowerCase().indexOf(criterion) !== -1
                  // || lander.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1){
                    return lander;
                }
              };
            }
          });

          //make landers view and display data
          var landersListView = new ListView({
            collection: filteredLanderCollection
          });

          landersListLayout.on("landers:filterList", function(filterVal){
            filteredLanderCollection.filter(filterVal);
          });
          
          landersListLayout.landersCollectionRegion.show(landersListView);

        });
      }
    }
  });

  return Moonlander.LandersApp.List.Controller;
});