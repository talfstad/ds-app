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
    DeployedLandersView, DeployedDomainsView, DeployedLanderModel, DeployedDomainModel,
    JobModel) {
    Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredCampaignCollection: null,


        deployCampaignLandersToDomain: function(attr) {

          var campaignModel = attr.campaign_model;
          var deployedDomainModel = attr.deployed_domain_model;

          var deployedDomains = campaignModel.get("deployedDomains");

          if (!deployedDomainModel) {
            return false;
          }

          var campaign_id = campaignModel.get("id");

          var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");

          var deployedLandersCollection = campaignModel.get("deployedLanders");
          deployedLandersCollection.each(function(deployedLanderModel) {

            //if there are any landers set deploy status to deploying
            deployedDomainModel.set("deploy_status", "deploying");

            var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");


            //create deploy job for domain and add it to the domain and the lander model
            var jobAttributes = {
              action: "deployLanderToDomain",
              lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
              domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
              campaign_id: campaign_id
            };
            var jobModel = new JobModel(jobAttributes);

            deployedLanderModelActiveJobs.add(jobModel);

            deployedDomainModelActiveJobs.add(jobModel);

            Moonlander.trigger("job:start", jobModel);

          });

          if (deployedLandersCollection.length <= 0) {
            deployedDomainModel.set("deploy_status", "deployed");
          }

          deployedDomains.add(deployedDomainModel);


        },


        deployLanderToCampaignDomains: function(attr) {
          var campaignModel = attr.campaign_model;
          var deployedLanderModel = attr.deployed_lander_model;

          var deployedLanders = campaignModel.get("deployedLanders");

          if (!deployedLanderModel) {
            return false;
          }

          var campaign_id = campaignModel.get("id");

          var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");

          //now we have lander model, we can create our jobs
          var deployedDomainsCollection = campaignModel.get("deployedDomains");
          deployedDomainsCollection.each(function(deployedDomainModel) {

            //if there are any domains set deploy status to deploying
            deployedLanderModel.set("deploy_status", "deploying");

            var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");


            //create deploy job for domain and add it to the domain and the lander model
            var jobAttributes = {
              action: "deployLanderToDomain",
              lander_id: deployedLanderModel.get("lander_id"),
              domain_id: deployedDomainModel.get("domain_id"),
              campaign_id: campaign_id
            };
            var jobModel = new JobModel(jobAttributes);

            deployedLanderModelActiveJobs.add(jobModel);

            deployedDomainModelActiveJobs.add(jobModel);

            Moonlander.trigger("job:start", jobModel);

          });

          if (deployedDomainsCollection.length <= 0) {
            deployedLanderModel.set("deploy_status", "deployed");
          }

          deployedLanders.add(deployedLanderModel);

        },


        addCampaign: function(model) {

          Moonlander.trigger('campaigns:closesidebar');
          this.filteredCampaignCollection.add(model);
          //1. goto page with new lander on it
          this.filteredCampaignCollection.showPageWithModel(model);
          //2. expand new lander
          model.trigger("view:expand");

        },


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
                  if (lander.get('name').toLowerCase().indexOf(criterion) !== -1) {
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

            campaignCollection.on("resortAndExpandModelView", function(model) {
              campaignsListView.trigger("campaigns:sort");

              me.filteredCampaignCollection.showPageWithModel(model);
              model.trigger("view:expand");
              model.trigger("notifySuccessChangeCampaignName");
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

                  deployedDomainsCollection.on("showRemoveDomain", function(domainModel) {
                    var attr = {
                      campaign_model: campaignView.model,
                      domain_model: domainModel
                    };
                    Moonlander.trigger("campaigns:showRemoveDomain", attr);
                  });

                  deployedDomainsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_domains_count", length);
                  });

                  var deployedLandersCollection = campaignView.model.get("deployedLanders");
                  //give landers deployed domains ref
                  deployedLandersCollection.deployedDomains = deployedDomainsCollection;

                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersCollection.on("showRemoveLander", function(landerModel) {
                    var attr = {
                      campaign_model: campaignView.model,
                      lander_model: landerModel
                    };
                    Moonlander.trigger("campaigns:showRemoveLander", attr);
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
