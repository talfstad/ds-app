define(["app",
    "assets/js/apps/landerds/domains/list/views/list_view",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/common/filtered_paginated/paginated_model",
    "assets/js/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/domains/list/views/topbar_view",
    "assets/js/apps/landerds/domains/list/views/loading_view",
    "assets/js/apps/landerds/domains/list/views/lander_tab_handle_view",
    "assets/js/apps/landerds/domains/list/views/campaign_tab_handle_view",
    "assets/js/apps/landerds/domains/list/deployed_landers/views/deployed_landers_collection_view",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/domains/list/active_campaigns/views/active_campaigns_collection_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/domains/dao/active_campaign_model",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/help/help_app",
    "assets/js/apps/landerds/domains/list/views/list_layout_view"
  ],
  function(Landerds, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, CampaignTabHandleView,
    DeployedLandersView, DeployedDomainsCollection, ActiveCampaignsView, DeployedLanderModel,
    JobModel, ActiveCampaignModel, Notification, BaseListController) {
    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = _.extend({ //BaseListController

        initialize: function() {
          this.BaseClassInitialize();
        },

        showDomains: function(domain_id_to_goto_and_expand) {
          if (domain_id_to_goto_and_expand) {
            this.childExpandedId = domain_id_to_goto_and_expand;
          }

          //init the controller
          this.initialize();

          //make layout for landers
          var me = this;
          var domainsListLayout = new List.Layout();
          domainsListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(domainsListLayout);

          var loadingView = new LoadingView();
          domainsListLayout.landersCollectionRegion.show(loadingView);


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
              total_undeploying: 0,
              total_initializing: 0,
              total: 0,
              total_modified: 0,
              total_not_deployed: 0,
              total_num_items: 0
            })
          });

          domainsListLayout.topbarRegion.show(topbarView);

          //request landers collection
          var deferredLandersCollection = Landerds.request("domains:domainsCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
              collection: landersCollection,
              paginated: true,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(lander) {
                  if (lander.get('domain').toLowerCase().indexOf(criterion) !== -1) {
                    return lander;
                  }
                };
              }
            });

            //when lander is deleted successfully show a notification
            me.filteredCollection.original.on("destroy", function(model) {
              Notification("", "Successfully Deleted " + model.get("domain"), "success", "stack_top_right");
            });

            //make landers view and display data
            var domainsListView = new ListView({
              collection: me.filteredCollection
            });

            domainsListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            domainsListLayout.on("domains:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            domainsListLayout.on("domains:sort", function() {
              domainsListView.trigger("domains:sort");
            });

            domainsListLayout.on("domains:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            domainsListLayout.on("toggleInfo", function() {
              if (me.filteredCollection) {
                var toggle = this.toggleHelpInfo();

                if (toggle) {
                  //show empty view
                  me.filteredCollection.showEmpty(true);
                } else {
                  //show domainsListView
                  me.filteredCollection.showEmpty(false);
                }
              }
            });

            if (domainsListLayout.isRendered) {
              domainsListLayout.landersCollectionRegion.show(domainsListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            //on child expanded save for re-open on reset
            domainsListView.on("childview:childExpanded", function(childView, data) {
              me.childExpandedId = childView.model.get("id");
            });
            //on child collapse if is current expanded then reset to null
            domainsListView.on("childview:childCollapsed", function(childView, data) {
              var childCollapsedModel = childView.model;
              if (me.childExpandedId == childCollapsedModel.get("id")) {
                me.childExpandedId = null;
              }
            });

            me.filteredCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('domains:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                domainsListView.children.each(function(domainView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: domainView.model
                  });

                  var campaignTabHandleView = new CampaignTabHandleView({
                    model: domainView.model
                  });

                  var activeCampaignsCollection = domainView.model.get("activeCampaigns");
                  //set landername to be used by campaign models dialog

                  activeCampaignsCollection.domain = domainView.model.get("domain");

                  var activeCampaignsView = new ActiveCampaignsView({
                    collection: activeCampaignsCollection
                  });

                  activeCampaignsCollection.off("showUndeployDomainFromCampaignDialog");
                  activeCampaignsCollection.on("showUndeployDomainFromCampaignDialog", function(campaignModel) {
                    var attr = {
                      campaign_model: campaignModel,
                      domain_model: domainView.model
                    };
                    Landerds.trigger("domains:showUndeployDomainFromCampaignDialog", attr);
                  });

                  activeCampaignsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_campaigns_count", length);
                  });

                  var deployedLandersCollection = domainView.model.get("deployedLanders");

                  //set the domain for child views
                  deployedLandersCollection.domain = domainView.model.get("domain");
                  deployedLandersCollection.domain_id = domainView.model.get("id");
                  deployedLandersCollection.activeCampaignCollection = activeCampaignsCollection;

                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersView.on("childview:undeployLander", function(childView, landerModel) {
                    var attr = {
                      deployedLanderModel: landerModel,
                      domainModel: domainView.model
                    };

                    Landerds.trigger("domains:showUndeployLander", attr);
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedLandersView.on("childview:selectCampaignTab", function(one, two, three) {
                    domainView.$el.find("a[href=#campaigns-tab-id-" + domainView.model.get("id") + "]").tab('show')
                  });

                  deployedLandersView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_landers_count", length);
                    domainView.reAlignTableHeader();
                  });


                  landerTabHandleView.on("reAlignHeader", function() {
                    domainView.reAlignTableHeader();
                  });

                  domainView.lander_tab_handle_region.show(landerTabHandleView);
                  domainView.campaign_tab_handle_region.show(campaignTabHandleView);
                  domainView.deployed_landers_region.show(deployedLandersView);
                  domainView.active_campaigns_region.show(activeCampaignsView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("domains:updateTopbarTotals");

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

            if (domainsListLayout.isRendered) {
              domainsListLayout.footerRegion.show(paginatedButtonView);
              domainsListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".lander-search").val() || "";
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

        removeDeployedLanderModelFromCollection: function(deployedLanderModelToRemove) {
          var domain_id = deployedLanderModelToRemove.get("domain_id");
          var domainModel = this.filteredCollection.original.get(domain_id);

          var deployedLanderCollection = domainModel.get("deployedLanders");
          deployedLanderCollection.remove(deployedLanderModelToRemove);
        },

        undeployLandersFromDomain: function(attr) {
          var domainModel = attr.domainModel;
          var undeployLanderIdsArr = attr.undeployLanderIdsArr;

          var domain_id = domainModel.get("id");

          var deployedLanderCollection = domainModel.get("deployedLanders");
          var deployedLanderJobList = [];

          $.each(undeployLanderIdsArr, function(idx, landerToUndeployId) {

            deployedLanderCollection.each(function(deployedLanderModel) {
              if (landerToUndeployId == deployedLanderModel.get("lander_id")) {

                deployedLanderJobList.push({
                  lander_id: landerToUndeployId,
                  domain_id: domain_id,
                  action: "undeployLanderFromDomain",
                  deploy_status: "undeploying"
                });
              }
            });
          });

          var undeployJobModel = new JobModel({
            action: "undeployLanderFromDomain",
            list: deployedLanderJobList,
            model: {}, //just an empty object (is required at minimum)
            neverAddToUpdater: true
          });

          var undeployJobAttributes = {
            jobModel: undeployJobModel,
            onSuccess: function(responseJobList) {

              //create job models for each deployed domain and add them!
              deployedLanderCollection.each(function(deployedLanderModel) {
                $.each(responseJobList, function(idx, responseJobAttr) {

                  if (deployedLanderModel.get("lander_id") == responseJobAttr.lander_id) {
                    //create new individual job model for
                    var activeJobs = deployedLanderModel.get("activeJobs");
                    var newUndeployJob = new JobModel(responseJobAttr);

                    //remove active any deploy jobs for this deployed domain
                    activeJobs.each(function(job) {
                      if (job.get("action") == "deployLanderToDomain" ||
                        job.get("action") == "undeployLanderFromDomain") {
                        //remove from updater and destroy job
                        job.set("canceled", true);
                        Landerds.updater.remove(this);
                        delete job.attributes.id;
                        job.destroy();
                      }
                    });
                    activeJobs.add(newUndeployJob);
                    //call start for each job 
                    Landerds.trigger("job:start", newUndeployJob);
                  }
                });
              });
            }
          };

          Landerds.trigger("job:start", undeployJobAttributes);

        },


        deployNewLander: function(attr) {
          this.baseClassDeployLandersToDomain(attr);
          this.redeployLanders(attr.landerModel);
        },

        redeployLanders: function(landerModel) {
          var me = this;
          //for domains on callback we need to add the id to the deployed row, 
          //but for each redeploy job response we need to find the deployed lander in the domains
          //list and add the job to that deployed lander


          var onAfterRedeployCallback = function(responseJobList) {

            //set the active_campaign_id if we have one. MUST do this outside of the 
            //add job loop incase there are not any landers to deploy
            // $.each(responseJobList, function(idx, responseJobAttr) {
            //   if (responseJobAttr.active_campaign_id) {
            //     activeCampaignsCollection.each(function(activeCampaign) {
            //       if (!activeCampaign.get("id")) {
            //         activeCampaign.set("id", responseJobAttr.active_campaign_id);
            //       }
            //     });
            //   }
            // });

            me.filteredCollection.original.each(function(domainModel) {

              var deployedLanderCollection = domainModel.get("deployedLanders");

              deployedLanderCollection.each(function(deployedLander) {

                $.each(responseJobList, function(idx, responseJobAttr) {
                  if (responseJobAttr.lander_id == deployedLander.get("lander_id") &&
                    responseJobAttr.domain_id == deployedLander.get("domain_id")) {

                    //set the ID for the deployed domain row if it's new
                    if (responseJobAttr.new && responseJobAttr.deployed_row_id && !deployedLander.get("id")) {
                      deployedLander.set("id", responseJobAttr.deployed_row_id);
                    }

                    var activeJobs = deployedLander.get("activeJobs");
                    var newDeployJob = new JobModel(responseJobAttr);

                    //remove active any deploy or undeploy jobs for this deployed domain
                    activeJobs.each(function(job) {
                      if (job.get("action") == "deployLanderToDomain" ||
                        job.get("action") == "undeployLanderFromDomain") {
                        //remove from updater and destroy job
                        job.set("canceled", true);
                        Landerds.updater.remove(this);
                        delete job.attributes.id;
                        job.destroy();
                      }
                    });

                    activeJobs.add(newDeployJob);

                    //also add the job to any active campaigns that have this domain_id
                    // activeCampaignsCollection.each(function(activeCampaign) {
                    //   var domains = activeCampaign.get("domains");
                    //   $.each(domains, function(idx, domain) {
                    //     if (domain.domain_id == newDeployJob.get("domain_id")) {
                    //       var activeCampaignActiveJobs = activeCampaign.get("activeJobs");
                    //       activeCampaignActiveJobs.add(newDeployJob);
                    //     }
                    //   });
                    // });

                    //call start for each job 
                    Landerds.trigger("job:start", newDeployJob);

                  }
                });
              });
            });
          };

          this.baseClassRedeployLanders(landerModel, onAfterRedeployCallback);

        },

        //remove the domain from the landers list by starting a delete job!
        deleteDomain: function(model) {
          var domain_id = model.get("id");
          var domainModel = this.filteredCollection.original.get(domain_id);

          var deleteJobList = [{
            action: "deleteDomain",
            domain_id: domainModel.get("id"),
            deploy_status: "deleting"
          }];

          var deleteJobModel = new JobModel({
            action: "deleteDomain",
            list: deleteJobList,
            model: null,
            neverAddToUpdater: true
          });

          var deleteJobAttributes = {
            jobModel: deleteJobModel,
            onSuccess: function(responseJobList) {

              if (responseJobList.length > 0) {
                var deleteDomainAttr = responseJobList[0];

                var jobModel = new JobModel(deleteDomainAttr);

                var activeJobCollection = domainModel.get("activeJobs");
                activeJobCollection.add(jobModel);

                Landerds.trigger("job:start", jobModel);
              }
            }
          };

          Landerds.trigger("job:start", deleteJobAttributes);

        }






      }, BaseListController);
    });

    return Landerds.DomainsApp.Domains.List.Controller;
  });
