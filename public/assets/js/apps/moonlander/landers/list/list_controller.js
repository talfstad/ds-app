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
                  if (lander.get('name').toLowerCase().indexOf(criterion) !== -1){
                    // || lander.get('last_updated').toLowerCase().indexOf(criterion) !== -1) {
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

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: filteredLanderCollection.state.gui
            });

            //on reset rebuild the collectionview layout from scratch
            filteredLanderCollection.on("destroy", function(one, two){
              alert("ih");
            });

            filteredLanderCollection.on("reset", function(collection) {

              var filteredCollection = this;
            
              if (this.length > 0) {
                landersListView.children.each(function(landerView) {

                  var deployStatusView = new DeployStatusView({
                    model: landerView.model
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedLocations");

                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  //add events before show!
                  //update the landerView layout with whatever the child has
                  deployedDomainsView.on("childview:updateParentLayout", function(childView, notDeployed, three) {
                    //update deploy status view
                    var deployStatus = "deployed";
                    this.children.each(function(deployedDomainView){
                      if(deployedDomainView.model.get("activeJobs")) {
                        if(deployedDomainView.model.get("activeJobs").length > 0) {
                          deployStatus = "deploying";
                        }
                      }
                      //empty view passes not_deployed in as its arg
                      else if(notDeployed === "not_deployed") {
                        deployStatus = "not_deployed";
                      }
                    });
                    deployStatusView.model.set("deploy_status", deployStatus);
                  });

                  //whenever the deployed status view is updated update deployed totals
                  //this should be rendered whenever there is a change to the landers deployed status
                  deployStatusView.on("render", function() {
                    filteredCollection.updateTotals();
                  });

                  landerView.deploy_status_region.show(deployStatusView);
                  landerView.deployed_domains_region.show(deployedDomainsView);

                });
              }
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
