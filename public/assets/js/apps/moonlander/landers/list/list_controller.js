define(["app",
    "/assets/js/apps/moonlander/landers/list/views/list_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_collection.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/common/filtered_paginated/paginated_button_view.js",
    "/assets/js/apps/moonlander/landers/list/views/topbar_view.js",
    "/assets/js/apps/moonlander/landers/list/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/list/views/deploy_status_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/domains/dao/domain_collection.js",
    "/assets/js/apps/moonlander/landers/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, LanderCollection, FilteredPaginatedCollection, 
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, DeployedDomainsView, DeployedDomainsCollection) {
    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        showLanders: function() {
          //make layout for landers
          var landersListLayout = new List.Layout();
          landersListLayout.render();

          Moonlander.rootRegion.currentView.mainContentRegion.show(landersListLayout);

          var loadingView = new LoadingView();
          landersListLayout.landersCollectionRegion.show(loadingView);

          //request landers collection
          var deferredLandersCollection = Moonlander.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            var filteredLanderCollection = FilteredPaginatedCollection({
              collection: landersCollection,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(lander) {
                  if (lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
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

            landersListLayout.on("landers:filterList", function(filterVal) {
              filteredLanderCollection.filter(filterVal);

            });

            landersListLayout.on("landers:sort", function() {
              landersListView.trigger("landers:sort");
            });

            landersListLayout.on("landers:changepagesize", function(pageSize) {
              filteredLanderCollection.setPageSize(pageSize);
            });

            landersListLayout.landersCollectionRegion.show(landersListView);
          

            var topbarView = new TopbarView({
              model: filteredLanderCollection.state.gui
            });


            filteredLanderCollection.on("reset", function(collection){
              var filteredCollection = this;
              landersListView.children.each(function(view){
                var deployStatusView = new DeployStatusView({model: view.model});
                var deployedDomainsAttributes = view.model.get("deployedLocations");
                
                $.each(deployedDomainsAttributes, function(idx, location){
                  location.landerName = view.model.get("name");
                });

                var deployedDomainsCollection = new DeployedDomainsCollection(deployedDomainsAttributes);
                deployedDomainsCollection.urlEndpoints = view.model.get("urlEndpoints");
                

                var deployedDomainsView = new DeployedDomainsView({collection: deployedDomainsCollection});
                //add events before show!
                deployedDomainsView.on("updateParentLayout", function(deployStatus){
                  deployStatusView.model.set("deploy_status", deployStatus);

                });

                //whenever the deployed status view is updated update deployed totals
                //this should be rendered whenever there is a change to the landers deployed status
                deployStatusView.on("render", function(){
                  var notDeployedTotal = 0;
                  var deployingTotal = 0;
                  landersListView.children.each(function(lander){
                    var deployStatus = lander.model.get("deploy_status");
                    if(deployStatus === "not_deployed"){
                      notDeployedTotal++;
                    }
                    else if(deployStatus === "deploying"){ 
                      deployingTotal++;
                    }
                  });
                  filteredCollection.state.gui.set("total_not_deployed", notDeployedTotal);
                  filteredCollection.state.gui.set("total_deploying", deployingTotal);
                });

                view.deploy_status_region.show(deployStatusView);
                view.deployed_domains_region.show(deployedDomainsView);

              });
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: filteredLanderCollection.state.gui
            });
            paginatedButtonView.on("landers:firstPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              filteredLanderCollection.getFirstPage();
            });
            paginatedButtonView.on("landers:previousPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              filteredLanderCollection.getPreviousPage();
            });
            paginatedButtonView.on("landers:nextPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              filteredLanderCollection.getNextPage();
            });
            paginatedButtonView.on("landers:lastPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              filteredLanderCollection.getLastPage();
            });
            paginatedButtonView.on("landers:gotoPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              filteredLanderCollection.gotoPage(page);
            });

            landersListLayout.footerRegion.show(paginatedButtonView);


            
           
            landersListLayout.topbarRegion.show(topbarView);


            filteredLanderCollection.filter("");
          });
        }
      }
    });

    return Moonlander.LandersApp.Landers.List.Controller;
  });
