define(["app",
    "/assets/js/apps/moonlander/campaigns/list/views/list_view.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/common/filtered_paginated/paginated_model.js",
    "/assets/js/common/filtered_paginated/paginated_button_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/topbar_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/loading_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/lander_tab_handle_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/domain_tab_handle_view.js",
    "/assets/js/apps/moonlander/campaigns/list/deployed_landers/views/deployed_landers_collection_view.js",
    "/assets/js/apps/moonlander/campaigns/list/deployed_domains/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_lander_model.js",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_domain_model.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/campaigns/dao/campaign_collection.js",
    "/assets/js/apps/moonlander/campaigns/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, DomainTabHandleView,
    DeployedLandersView, DeployedDomainsView, DeployedDomainModel,
    JobModel) {
    Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredCampaignCollection: null,


        showCampaigns: function(model) {
          //make layout for campaigns
          var me = this;
          var campaignsListLayout = new List.Layout();
          campaignsListLayout.render();

          Moonlander.rootRegion.currentView.mainContentRegion.show(campaignsListLayout);

          var loadingView = new LoadingView();
          campaignsListLayout.campaignsCollectionRegion.show(loadingView);


          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel({
              current_page: 1,
              num_pages: 0,
              showing_high: 0,
              showing_low: 0,
              showing_total: 0,
              total_deleting: 0,
              total_deploying: 0,
              total_initializing: 0,
              total: 0,
              total_modified: 0,
              total_not_deployed: 0,
              total_num_items: 0
            })
          });

          campaignsListLayout.topbarRegion.show(topbarView);

          //request landers collection
          var deferredLandersCollection = Moonlander.request("campaigns:campaignsCollection");

          $.when(deferredLandersCollection).done(function(campaignCollection) {

            me.filteredCampaignCollection = FilteredPaginatedCollection({
              collection: campaignCollection,
              paginated: true,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(lander) {
                  if (lander.get('domain').toLowerCase().indexOf(criterion) !== -1) {
                    // || lander.get('last_updated').toLowerCase().indexOf(criterion) !== -1) {
                    // || lander.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1){
                    return lander;
                  }
                };
              }
            });

            //make landers view and display data
            var campaignsListView = new ListView({
              collection: me.filteredCampaignCollection
            });

            campaignsListLayout.on("campaigns:filterList", function(filterVal) {
              me.filteredCampaignCollection.filter(filterVal);
            });

            campaignsListLayout.on("campaigns:sort", function() {
              campaignsListView.trigger("campaigns:sort");
            });

            campaignsListLayout.on("campaigns:changepagesize", function(pageSize) {
              me.filteredCampaignCollection.setPageSize(pageSize);
            });

            if (campaignsListLayout.isRendered) {
              campaignsListLayout.campaignsCollectionRegion.show(campaignsListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCampaignCollection.state.gui
            });

            me.filteredCampaignCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Moonlander.trigger('campaigns:closesidebar');
              Moonlander.trigger('campaigns:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                campaignsListView.children.each(function(campaignView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: campaignView.model
                  });

                  var domainTabHandleView = new DomainTabHandleView({
                    model: campaignView.model
                  });

                  var deployedDomainsCollection = campaignView.model.get("deployedDomains");
                  //set landername to be used by campaign models dialog
                  deployedDomainsCollection.name = campaignView.model.get("name");
                  deployedDomainsCollection.deploy_status = campaignView.model.get("deploy_status");

                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  deployedDomainsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_domains_count", length);
                  });

                  var deployedLandersCollection = campaignView.model.get("deployedLanders");
                  //set the domain for child views
                  deployedLandersCollection.domain = campaignView.model.get("domain");
                  deployedLandersCollection.domain_id = campaignView.model.get("id");


                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_landers_count", length);
                    campaignView.reAlignTableHeader();
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedLandersView.on("childview:selectCampaignTab", function(one, two, three) {
                    campaignView.$el.find("a[href=#domains-tab-id-" + campaignView.model.get("id") + "]").tab('show')
                  });

                  landerTabHandleView.on("reAlignHeader", function() {
                    campaignView.reAlignTableHeader();
                  });


                  //update view information on model change
                  campaignView.model.on("change:deploy_status", function() {
                    Moonlander.trigger("campaigns:updateTopbarTotals");

                    //if not deployed make sure that the deployed
                    if (this.get("deploy_status") == "not_deployed") {
                      deployedLandersCollection.isInitializing = false;
                    }

                    // render if is showing AND EMPTY else dont (this logic meant for initializing state)
                    if (deployedLandersView.isRendered && deployedLandersCollection.length <= 0) {
                      deployedLandersView.render();
                    }
                    if (deployedDomainsView.isRendered && deployedDomainsCollection.length <= 0) {
                      deployedDomainsView.render();
                    }

                    //if deleting then trigger delete state on campaignView
                    if (campaignView.isRendered && this.get("deploy_status") === "deleting") {
                      campaignView.disableAccordionPermanently();
                      //close sidebar
                      Moonlander.trigger('campaigns:closesidebar');

                    }
                  });


                  campaignView.lander_tab_handle_region.show(landerTabHandleView);
                  campaignView.domain_tab_handle_region.show(domainTabHandleView);
                  campaignView.deployed_landers_region.show(deployedLandersView);
                  campaignView.deployed_domains_region.show(deployedDomainsView);
                });
              }

              //set topbar totals on reset
              Moonlander.trigger("campaigns:updateTopbarTotals")
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredCampaignCollection.state.gui
            });
            paginatedButtonView.on("firstPage", function(page) {
              me.filteredCampaignCollection.getFirstPage();
            });
            paginatedButtonView.on("previousPage", function(page) {
              me.filteredCampaignCollection.getPreviousPage();
            });
            paginatedButtonView.on("nextPage", function(page) {
              me.filteredCampaignCollection.getNextPage();
            });
            paginatedButtonView.on("lastPage", function(page) {
              me.filteredCampaignCollection.getLastPage();
            });
            paginatedButtonView.on("gotoPage", function(page) {
              me.filteredCampaignCollection.gotoPage(page);
            });


            if (campaignsListLayout.isRendered) {
              campaignsListLayout.footerRegion.show(paginatedButtonView);
              campaignsListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".lander-search").val() || "";
            me.filteredCampaignCollection.filter(filterVal);
          });
        },

        
        updateTopbarTotals: function() {
          if (this.filteredCampaignCollection) {
            this.filteredCampaignCollection.updateTotals();
          }
        }
      }
    });

    return Moonlander.CampaignsApp.Campaigns.List.Controller;
  });


