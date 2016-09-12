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
    DeployedLandersView, ActiveCampaignsView, DeployedLanderModel,
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
            model: new PaginatedModel
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
                  deployedLandersCollection.activeCampaigns = activeCampaignsCollection;

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


        deployLandersToDomain: function(attr) {
          //handles both if we have a lander model and if we dont
          if (attr.landerModel) {
            this.baseClassDeployLandersToDomain(attr);
          } else {
            this.addUndeployedLanderRows(attr);
          }
          this.redeployLanders(attr);
        },

        addUndeployedLanderRows: function(attr) {
          var me = this;
          attr.deployList = [];

          var domainModel = attr.model;
          var listToDeploy = attr.listToDeploy;

          var masterLander = listToDeploy[0];

          if (!masterLander.noLandersToAdd) {

            //create a list of deployed domain models to create for redeploy
            var deployedLanders = domainModel.get("deployedLanders");
            $.each(listToDeploy, function(idx, landerToDeployAttributes) {

              var isDeployed = false;
              var shouldRedeploy = true;

              deployedLanders.each(function(deployedLander) {
                if (deployedLander.get("lander_id") == landerToDeployAttributes.lander_id) {
                  isDeployed = true;
                  shouldRedeploy = false;
                  //override if undeploying its not deployed
                  var activeJobs = deployedLander.get("activeJobs");
                  activeJobs.each(function(activeJob) {
                    if (activeJob.get("action") == "undeployLanderFromDomain") {
                      landerToDeployAttributes = deployedLander;
                      shouldRedeploy = true;
                    }
                  });
                }
              });

              //create the deployed lander model, use current one if already created
              var deployedLanderModel = landerToDeployAttributes;
              if (!(deployedLanderModel instanceof Backbone.Model)) {
                deployedLanderModel = new DeployedLanderModel(landerToDeployAttributes);
              }

              if (!isDeployed) {
                deployedLanders.add(deployedLanderModel);
                //set to deploying to start
                deployedLanderModel.set("deploy_status", "deploying");
              }

              //push new if got no id, or if it has a job thats undeploying
              if (shouldRedeploy) {
                attr.deployList.push(deployedLanderModel);
              }

            });
          }
        },

        redeployLanders: function(attr) {
          var me = this;

          //used for deploying 1 lander on deploy lander
          //and used for multiple in add campaign. 
          //when using for multiple landers no landerModel will be here.
          //in that case, get the redeploy jobs for the deployed landers without ids yet
          //because those are the ones we're adding


          var onAfterRedeployCallback = function(responseJobList) {

            me.filteredCollection.original.each(function(domainModel) {

              var deployedLanderCollection = domainModel.get("deployedLanders");
              var activeCampaignCollection = domainModel.get("activeCampaigns");

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

                    //also add the job to any active campaigns that have this lander_id
                    activeCampaignCollection.each(function(activeCampaign) {
                      //if active campaign doesn't have an id, add the active_campaign_id as its id
                      if (!activeCampaign.get("id")) {
                        activeCampaign.set("id", responseJobAttr.active_campaign_id);
                      }

                      var activeCampaignLanders = activeCampaign.get("landers");
                      $.each(activeCampaignLanders, function(idx, activeCampaignDeployedLander) {

                        if (activeCampaignDeployedLander.lander_id == newDeployJob.get("lander_id")) {
                          var activeCampaignActiveJobs = activeCampaign.get("activeJobs");
                          activeCampaignActiveJobs.add(newDeployJob);
                        }
                      });
                    });

                    //call start for each job 
                    Landerds.trigger("job:start", newDeployJob);

                  }
                });
              });
            });
          };

          var landerModel = attr.landerModel;
          var deployedDomainsJobList = [];
          var addActiveCampaignModel;

          //get the list of redeploy jobs. handles for landermodel and for multiple
          //deployed landers
          if (landerModel) {
            var landerRedeployAttr = this.getLanderRedeployJobs(landerModel);
            deployedDomainsJobList = landerRedeployAttr.list;
            addActiveCampaignModel = landerRedeployAttr.addActiveCampaignModel;
          } else {
            //add active campaign doesnt have an id yet
            var activeCampaigns = attr.model.get("activeCampaigns");
            activeCampaigns.each(function(campaign) {
              if (!campaign.get("id")) {
                addActiveCampaignModel = campaign;
              }
            });
            //loop to get all the jobs for these landers
            //using deployed landers for deployed domains beacuse all we check is the similar active jobs
            $.each(attr.deployList, function(index, newDeployedLanderModel) {
              //search all domains for this lander and create a deployedDomain collection from it
              // var deployedDomainCollection = new DeployedDomainCollection();
              // me.filteredCollection.each(function(domainModel) {
              //   var deployedLanders = domainModel.get("deployedLanders");
              //   deployedLanders.each(function(deployedLander) {
              //     if (deployedLander.get("lander_id") == newDeployedLanderModel.get("lander_id")) {
              //       //this domain is of the domains this lander is on
              //       deployedDomainCollection.add(deployedLander);
              //     }
              //   });
              // });
              // newDeployedLanderModel.set("deployedDomains", deployedDomainCollection);

              var landerRedeployAttr = me.getLanderRedeployJobs(newDeployedLanderModel);
              deployedDomainsJobList = deployedDomainsJobList.concat(landerRedeployAttr.list);
            });
          }

          var redeployJobModel = new JobModel({
            action: "deployLanderToDomain",
            list: deployedDomainsJobList,
            model: landerModel,
            addActiveCampaignModel: addActiveCampaignModel,
            neverAddToUpdater: true
          });

          var redeployJobAttributes = {
            jobModel: redeployJobModel,
            onSuccess: onAfterRedeployCallback
          };

          Landerds.trigger("job:start", redeployJobAttributes);

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
