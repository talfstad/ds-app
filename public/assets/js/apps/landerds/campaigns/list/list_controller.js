define(["app",
    "assets/js/apps/landerds/campaigns/list/views/list_view",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/common/filtered_paginated/paginated_model",
    "assets/js/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/campaigns/list/views/topbar_view",
    "assets/js/apps/landerds/campaigns/list/views/loading_view",
    "assets/js/apps/landerds/campaigns/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/campaigns/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/campaigns/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/campaigns/list/domains/views/domains_collection_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/apps/landerds/campaigns/dao/domain_list_model",
    "assets/js/jobs/jobs_model",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/help/help_app",
    "assets/js/apps/landerds/campaigns/dao/campaign_collection",
    "assets/js/apps/landerds/campaigns/list/views/list_layout_view"
  ],
  function(Landerds, ListView, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, DomainTabHandleView,
    DeployedLandersView, DomainListView, DeployedLanderModel, DomainListModel,
    JobModel, Notification, BaseListController) {
    Landerds.module("CampaignsApp.Campaigns.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = _.extend({ //BaseListController

        initialize: function() {
          this.BaseClassInitialize();
        },

        showCampaigns: function(campaign_id_to_goto_and_expand) {
          if (campaign_id_to_goto_and_expand) {
            this.childExpandedId = campaign_id_to_goto_and_expand;
          }

          //init the controller
          this.initialize();

          //make layout for campaigns
          var me = this;
          var campaignsListLayout = new List.Layout();
          campaignsListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(campaignsListLayout);

          var loadingView = new LoadingView();
          campaignsListLayout.campaignsCollectionRegion.show(loadingView);


          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel
          });

          campaignsListLayout.topbarRegion.show(topbarView);

          //request campaigns collection
          var deferredCampaignsCollection = Landerds.request("campaigns:campaignsCollection");

          $.when(deferredCampaignsCollection).done(function(campaignCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
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
              collection: me.filteredCollection
            });

            campaignsListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            campaignsListLayout.on("campaigns:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            campaignsListLayout.on("campaigns:sort", function() {
              campaignsListView.trigger("campaigns:sort");
            });

            campaignsListLayout.on("campaigns:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            campaignsListLayout.on("toggleInfo", function() {
              if (me.filteredCollection) {
                var toggle = this.toggleHelpInfo();

                if (toggle) {
                  //show empty view
                  me.filteredCollection.showEmpty(true);
                } else {
                  //show landersListView
                  me.filteredCollection.showEmpty(false);
                }
              }
            });

            if (campaignsListLayout.isRendered) {
              campaignsListLayout.campaignsCollectionRegion.show(campaignsListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            //on child expanded save for re-open on reset
            campaignsListView.on("childview:childExpanded", function(childView, data) {
              me.childExpandedId = childView.model.get("id");
            });
            //on child collapse if is current expanded then reset to null
            campaignsListView.on("childview:childCollapsed", function(childView, data) {
              var childCollapsedModel = childView.model;
              if (me.childExpandedId == childCollapsedModel.get("id")) {
                me.childExpandedId = null;
              }
            });

            me.filteredCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('campaigns:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                campaignsListView.children.each(function(campaignView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: campaignView.model
                  });

                  var domainTabHandleView = new DomainTabHandleView({
                    model: campaignView.model
                  });

                  campaignView.on("renderAndShowThisViewsPage", function() {
                    // me.showRow(campaignView.model);
                    me.expandAndShowRow(campaignView.model);
                  });


                  var domainListCollection = campaignView.model.get("domains");
                  //set landername to be used by campaign models dialog
                  // domainListCollection.name = campaignView.model.get("name");
                  domainListCollection.campaign_id = campaignView.model.get("id");

                  var domainListView = new DomainListView({
                    collection: domainListCollection
                  });

                  domainListCollection.on("showRemoveDomain", function(domainModel) {
                    var attr = {
                      campaign_model: campaignView.model,
                      domain_model: domainModel
                    };
                    Landerds.trigger("campaigns:showRemoveDomain", attr);
                  });

                  domainListView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("domains_count", length);
                  });


                  var deployedLandersCollection = campaignView.model.get("deployedLanders");
                  //give landers deployed domains ref
                  deployedLandersCollection.domainListCollection = domainListCollection;

                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersCollection.on("showRemoveLander", function(landerModel) {
                    var attr = {
                      campaign_model: campaignView.model,
                      lander_model: landerModel
                    };
                    Landerds.trigger("campaigns:showRemoveLander", attr);
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

                  campaignView.lander_tab_handle_region.show(landerTabHandleView);
                  campaignView.domain_tab_handle_region.show(domainTabHandleView);
                  campaignView.deployed_landers_region.show(deployedLandersView);
                  campaignView.domains_region.show(domainListView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("campaigns:updateTopbarTotals");

              if (me.childExpandedId) {
                //only expand it if its in the current filtered collection
                var modelToExpand = me.filteredCollection.get(me.childExpandedId);
                if (modelToExpand) {
                  modelToExpand.trigger("view:expand");
                }
              }
            });

            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredCollection.state.gui
            });
            paginatedButtonView.on("firstPage", function(page) {
              me.filteredCollection.getFirstPage();
            });
            paginatedButtonView.on("previousPage", function(page) {
              me.filteredCollection.getPreviousPage();
            });
            paginatedButtonView.on("nextPage", function(page) {
              me.filteredCollection.getNextPage();
            });
            paginatedButtonView.on("lastPage", function(page) {
              me.filteredCollection.getLastPage();
            });
            paginatedButtonView.on("gotoPage", function(page) {
              me.filteredCollection.gotoPage(page);
            });

            if (campaignsListLayout.isRendered) {
              campaignsListLayout.footerRegion.show(paginatedButtonView);
              campaignsListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".list-search").val() || "";
            if (me.filteredCollection.length > 0) {
              me.filteredCollection.filter(filterVal);
            }

            if (me.childExpandedId) {
              var modelToExpand = me.filteredCollection.original.get(me.childExpandedId)
              if (modelToExpand) {
                me.expandAndShowRow(modelToExpand);
              }
            }
          });
        },

        // deployCampaignLandersToDomain: function(attr) {

        //   var campaignModel = attr.campaign_model;
        //   var domainListModel = attr.domain_list_model;

        //   var domainList = campaignModel.get("domains");

        //   if (!domainListModel) {
        //     return false;
        //   }

        //   var campaign_id = campaignModel.get("id");

        //   var deployedDomainModelActiveJobs = domainListModel.get("activeJobs");

        //   var deployedLandersCollection = campaignModel.get("deployedLanders");
        //   deployedLandersCollection.each(function(deployedLanderModel) {

        //     //if there are any landers set deploy status to deploying
        //     domainListModel.set("deploy_status", "deploying");

        //     var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");


        //     //create deploy job for domain and add it to the domain and the lander model
        //     var jobAttributes = {
        //       action: "deployLanderToDomain",
        //       lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
        //       domain_id: domainListModel.get("domain_id") || domainListModel.get("id"),
        //       campaign_id: campaign_id,
        //       deploy_status: "deploying"
        //     };
        //     var jobModel = new JobModel(jobAttributes);

        //     deployedLanderModelActiveJobs.add(jobModel);

        //     deployedDomainModelActiveJobs.add(jobModel);

        //     Landerds.trigger("job:start", jobModel);

        //   });

        //   if (deployedLandersCollection.length <= 0) {
        //     domainListModel.set("deploy_status", "deployed");
        //   }

        //   domainList.add(domainListModel);


        // },


        // deployLanderToCampaignDomains: function(attr) {
        //   var campaignModel = attr.campaign_model;
        //   var deployedLanderModel = attr.deployed_lander_model;

        //   var deployedLanders = campaignModel.get("deployedLanders");

        //   if (!deployedLanderModel) {
        //     return false;
        //   }

        //   var campaign_id = campaignModel.get("id");

        //   var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");

        //   //now we have lander model, we can create our jobs
        //   var domainListCollection = campaignModel.get("domains");

        //   //notification that deployment may take up to 20 minutes
        //   if (domainListCollection.length > 1) {
        //     // Notification("Deploying Landing Pages", "May take up to 20 minutes", "success", "stack_top_right");
        //   } else {
        //     // Notification("Deploying Landing Page", "May take up to 20 minutes", "success", "stack_top_right");
        //   }

        //   domainListCollection.each(function(deployedDomainModel) {

        //     //if there are any domains set deploy status to deploying
        //     deployedLanderModel.set("deploy_status", "deploying");

        //     var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");


        //     //create deploy job for domain and add it to the domain and the lander model
        //     var jobAttributes = {
        //       action: "deployLanderToDomain",
        //       lander_id: deployedLanderModel.get("lander_id"),
        //       domain_id: deployedDomainModel.get("domain_id"),
        //       campaign_id: campaign_id,
        //       deploy_status: "deploying"
        //     };
        //     var jobModel = new JobModel(jobAttributes);

        //     deployedLanderModelActiveJobs.add(jobModel);

        //     deployedDomainModelActiveJobs.add(jobModel);

        //     Landerds.trigger("job:start", jobModel);

        //   });

        //   if (domainListCollection.length <= 0) {
        //     deployedLanderModel.set("deploy_status", "deployed");
        //   }

        //   deployedLanders.add(deployedLanderModel);

        // },


        addCampaign: function(model) {
          this.addRow(model);
          this.expandAndShowRow(model);
        }

        
      }, BaseListController);
    });

    return Landerds.CampaignsApp.Campaigns.List.Controller;
  });
