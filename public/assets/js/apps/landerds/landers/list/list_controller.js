define(["app",
    "assets/js/apps/landerds/landers/list/views/list_view",
    "assets/js/apps/landerds/landers/dao/lander_collection",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/common/filtered_paginated/paginated_model",
    "assets/js/common/filtered_paginated/paginated_button_view",
    "assets/js/apps/landerds/landers/list/views/topbar_view",
    "assets/js/apps/landerds/landers/list/views/loading_view",
    "assets/js/apps/landerds/landers/list/views/domain_tab_handle_view",
    "assets/js/apps/landerds/landers/list/views/campaign_tab_handle_view",
    "assets/js/apps/landerds/landers/list/deployed_domains/views/deployed_domains_collection_view",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaigns_collection_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/active_campaign_model",
    "assets/js/common/notification",
    "assets/js/apps/landerds/base_classes/list/list_controller_base",
    "assets/js/apps/help/help_app",
    "assets/js/apps/landerds/landers/list/views/list_layout_view"
  ],
  function(Landerds, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, CampaignTabHandleView,
    DeployedDomainsView, DeployedDomainsCollection, ActiveCampaignsView,
    JobModel, ActiveCampaignModel, Notification, BaseListController) {
    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = _.extend({ //BaseListController

        initialize: function() {
          this.BaseClassInitialize();
        },

        showLanders: function(lander_id_to_goto_and_expand) {

          //init the controller
          this.initialize();

          //make layout for landers
          var me = this;
          var landersListLayout = new List.Layout();
          landersListLayout.render();

          Landerds.rootRegion.currentView.mainContentRegion.show(landersListLayout);

          var loadingView = new LoadingView();
          landersListLayout.landersCollectionRegion.show(loadingView);

          //set initial topbar view crap reloads when data loads
          var topbarView = new TopbarView({
            model: new PaginatedModel({
              current_page: 1,
              num_pages: 0,
              showing_high: 0,
              showing_low: 0,
              showing_total: 0,
              total_deleting: 0,
              total_undeploying: 0,
              total_deploying: 0,
              total_initializing: 0,
              total: 0,
              total_modified: 0,
              total_not_deployed: 0,
              total_num_items: 0
            })
          });

          landersListLayout.topbarRegion.show(topbarView);


          //request landers collection
          var deferredLandersCollection = Landerds.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            me.filteredCollection = FilteredPaginatedCollection({
              collection: landersCollection,
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

            //when lander is deleted successfully show a notification
            me.filteredCollection.original.on("destroy", function(model) {
              Notification("", "Successfully Deleted " + model.get("name"), "success", "stack_top_right");
            });

            //make landers view and display data
            var landersListView = new ListView({
              collection: me.filteredCollection
            });

            landersListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            landersListLayout.on("landers:filterList", function(filterVal) {
              me.filteredCollection.filter(filterVal);
            });

            landersListLayout.on("landers:sort", function() {
              landersListView.trigger("landers:sort");
            });

            landersListLayout.on("landers:changepagesize", function(pageSize) {
              me.filteredCollection.setPageSize(pageSize);
            });

            landersListLayout.on("toggleInfo", function() {
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

            if (landersListLayout.isRendered) {
              landersListLayout.landersCollectionRegion.show(landersListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredCollection.state.gui
            });

            me.filteredCollection.original.on("change:modified", function(landerModel) {

              Landerds.trigger("landers:updateTopbarTotals");

              var deployedDomainsCollection = landerModel.get("deployedDomains");

              if (this.get("modified")) {
                //set all deployed domains to modified as well. modified is
                //as a whole lander, never individual deployed domains are modified
                deployedDomainsCollection.each(function(deployedDomain) {
                  deployedDomain.set("modified", true);
                });
              } else {
                deployedDomainsCollection.each(function(deployedDomain) {
                  deployedDomain.set("modified", false);
                });
              }

            });

            me.filteredCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('landers:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                landersListView.children.each(function(landerView) {

                  var domainTabHandleView = new DeployStatusView({
                    model: landerView.model
                  });

                  var campaignTabHandleView = new CampaignTabHandleView({
                    model: landerView.model
                  });

                  //handles changes, use css its way faster
                  landerView.model.off("change:currentPreviewEndpointId");
                  landerView.model.on("change:currentPreviewEndpointId", function(one, previewId, three) {
                    Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", landerView.model);
                  });

                  var activeCampaignsCollection = landerView.model.get("activeCampaigns");
                  //set landername to be used by campaign models dialog
                  activeCampaignsCollection.landerName = landerView.model.get("name");
                  activeCampaignsCollection.deploy_status = landerView.model.get("deploy_status");

                  var activeCampaignsView = new ActiveCampaignsView({
                    collection: activeCampaignsCollection
                  });

                  activeCampaignsCollection.off("showUndeployDomainFromCampaignDialog");
                  activeCampaignsCollection.on("showUndeployDomainFromCampaignDialog", function(campaignModel) {
                    var attr = {
                      campaign_model: campaignModel,
                      lander_model: landerView.model
                    };
                    Landerds.trigger("landers:showUndeployDomainFromCampaignDialog", attr);
                  });

                  activeCampaignsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_campaigns_count", length);
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedDomains");

                  deployedDomainsCollection.activeCampaignCollection = activeCampaignsCollection;
                  deployedDomainsCollection.urlEndpoints = landerView.model.get("urlEndpoints");

                  var landerViewDeploymentFolderName = landerView.model.get("deployment_folder_name");
                  deployedDomainsCollection.deployment_folder_name = landerViewDeploymentFolderName;


                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  deployedDomainsView.on("childview:showRemoveDomain", function(childView, domainModel) {
                    var attr = {
                      lander_model: landerView.model,
                      domain_model: domainModel
                    };
                    Landerds.trigger("landers:showRemoveDomain", attr);
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedDomainsView.on("childview:selectCampaignTab", function(one, two, three) {
                    landerView.$el.find("a[href=#campaigns-tab-id-" + landerView.model.get("id") + "]").tab('show')
                  });

                  deployedDomainsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    domainTabHandleView.model.set("deployed_domains_count", length);
                    landerView.reAlignTableHeader();
                  });

                  domainTabHandleView.on("reAlignHeader", function() {
                    landerView.reAlignTableHeader();
                  });


                  landerView.deploy_status_region.show(domainTabHandleView);
                  landerView.campaign_tab_handle_region.show(campaignTabHandleView);
                  landerView.deployed_domains_region.show(deployedDomainsView);
                  landerView.active_campaigns_region.show(activeCampaignsView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("landers:updateTopbarTotals")
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

            if (landersListLayout.isRendered) {
              landersListLayout.footerRegion.show(paginatedButtonView);
              landersListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".lander-search").val() || "";
            if (me.filteredCollection.length > 0) {
              me.filteredCollection.filter(filterVal);
            }

            if (lander_id_to_goto_and_expand) {
              var landerModelToExpand = me.filteredCollection.original.get(lander_id_to_goto_and_expand)
              if (landerModelToExpand) {
                me.expandAndShowRow(landerModelToExpand);
              }
            }
          });
        },

        undeployLanderFromDomains: function(undeployAttr) {
          var me = this;

          var landerModel = undeployAttr.landerModel;
          var undeployDomainIdsArr = undeployAttr.undeployDomainIdsArr;

          var lander_id = landerModel.get("id");

          var deployedDomainCollection = landerModel.get("deployedDomains");
          var deployedDomainsJobList = [];

          //find domain in deployed domains and create undeploy job for it
          $.each(undeployDomainIdsArr, function(idx, domainToUndeployId) {

            deployedDomainCollection.each(function(deployedDomain) {

              if (domainToUndeployId == deployedDomain.get("domain_id")) {
                deployedDomainsJobList.push({
                  lander_id: lander_id,
                  domain_id: domainToUndeployId,
                  action: "undeployLanderFromDomain",
                  deploy_status: "undeploying"
                });
              }
            });
          });

          var undeployJobModel = new JobModel({
            action: "undeployLanderFromDomain",
            list: deployedDomainsJobList,
            model: landerModel,
            neverAddToUpdater: true
          });

          var undeployJobAttributes = {
            jobModel: undeployJobModel,
            onSuccess: function(responseJobList) {

              //create job models for each deployed domain and add them!
              deployedDomainCollection.each(function(deployedDomainModel) {
                $.each(responseJobList, function(idx, responseJobAttr) {

                  if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {
                    //create new individual job model for
                    var activeJobs = deployedDomainModel.get("activeJobs");
                    var newUndeployJob = new JobModel(responseJobAttr);

                    //remove active any deploy jobs for this deployed domain
                    activeJobs.each(function(job) {
                      if (job.get("action") == "deployLanderToDomain") {
                        //remove from updater and destroy job
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
          this.baseClassDeployLandersToDomain(attr);
          this.redeployLanders(attr.landerModel);
        },

        redeployLanders: function(landerModel) {

          var onAfterRedeployCallback = function(responseJobList) {

            var activeCampaignsCollection = landerModel.get("activeCampaigns");
            var deployedDomainCollection = landerModel.get("deployedDomains");

            //redeploy happening so now we're working, not modified
            //set modified false since we are saving
            landerModel.set({
              modified: false
            });

            //its a save job (lander level if there are no deployed domains (or any that are not undeploying))
            var deployedAtLeastOne = false;

            //set the active_campaign_id if we have one. MUST do this outside of the 
            //add job loop incase there are not any landers to deploy
            $.each(responseJobList, function(idx, responseJobAttr) {
              if (responseJobAttr.active_campaign_id) {
                activeCampaignsCollection.each(function(activeCampaign) {
                  if (!activeCampaign.get("id")) {
                    activeCampaign.set("id", responseJobAttr.active_campaign_id);
                  }
                });
              }
            });

            //create job models for each deployed domain and add them!
            deployedDomainCollection.each(function(deployedDomainModel) {
              $.each(responseJobList, function(idx, responseJobAttr) {

                if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {

                  //set the ID for the deployed domain row if it's new
                  if (responseJobAttr.new && responseJobAttr.deployed_row_id) {
                    deployedDomainModel.set("id", responseJobAttr.deployed_row_id);
                  }

                  //create new individual job model for
                  var activeJobs = deployedDomainModel.get("activeJobs");
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
                  //if adding a deploy job it cant just be a save
                  deployedAtLeastOne = true;
                  activeJobs.add(newDeployJob);

                  //also add the job to any active campaigns that have this domain_id
                  activeCampaignsCollection.each(function(activeCampaign) {
                    var domains = activeCampaign.get("domains");
                    $.each(domains, function(idx, domain) {
                      if (domain.domain_id == newDeployJob.get("domain_id")) {
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

            if (!deployedAtLeastOne) {
              if (responseJobList.length != 1) {
                //just a quick save.. set saving_lander false be done
                landerModel.set("saving_lander", false);
              } else {
                responseJobAttr = responseJobList[0];
                if (responseJobAttr.action == "savingLander") {
                  //add this to the lander active jobs
                  var landerSaveJob = new JobModel(responseJobAttr);

                  var activeJobs = landerModel.get('activeJobs');
                  activeJobs.add(landerSaveJob);
                  Landerds.trigger("job:start", landerSaveJob);
                }
              }
            }
          };

          this.baseClassRedeployLanders(landerModel, onAfterRedeployCallback);

        },

        removeDeployedDomainModelFromCollection: function(deployedDomainToRemove) {
          var lander_id = deployedDomainToRemove.get("lander_id");
          var landerModel = this.filteredCollection.original.get(lander_id);

          var deployedDomains = landerModel.get("deployedDomains");
          deployedDomains.remove(deployedDomainToRemove);
        },


        updateAffectedLanderIdsRemoveActiveSnippets: function(affectedUrlEndpoints) {
          var me = this;

          $.each(affectedUrlEndpoints, function(idx, endpoint) {

            var landerId = endpoint.lander_id;
            var urlEndpointId = endpoint.url_endpoint_id;
            var activeSnippetId = endpoint.active_snippet_id;

            var landerToUpdate = me.filteredCollection.original.get(landerId);
            var urlEndpoints = landerToUpdate.get("urlEndpoints");
            var endpointToUpdate = urlEndpoints.get(urlEndpointId);
            var activeSnippets = endpointToUpdate.get("activeSnippets");
            var activeSnippetToRemove = activeSnippets.get(activeSnippetId);
            //get the url endpoint thats modified 
            if (activeSnippetToRemove) {
              activeSnippets.remove(activeSnippetToRemove);
              //update the sidemenu views
              Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", landerToUpdate);

              landerToUpdate.set({
                modified: true,
                no_optimize_on_save: false,
              });

            }
          });
        },

        updateAffectedLanderIdsToModified: function(affectedEndpoints) {
          var me = this;

          $.each(affectedEndpoints, function(idx, endpoint) {
            var landerId = endpoint.lander_id;

            var landerToUpdate = me.filteredCollection.original.get(landerId);

            if (landerToUpdate) {
              landerToUpdate.set({
                modified: true,
                no_optimize_on_save: false
              });
            }

          });

        },

        removeSnippetFromAllLanders: function(attr) {
          var me = this;
          var snippetToRemoveFromLanders = attr.snippet;
          var onSuccessCallback = attr.onSuccess;

          //loop original lander collection to remove active snippet from all url endpoints
          var landersToRedeploy = [];
          var activeSnippetsToRemove = [];

          this.filteredCollection.original.each(function(landerModel) {

            //create a full list of snippets to remove
            var urlEndpointsCollection = landerModel.get("urlEndpoints");
            var tmpActiveSnippetsToRemove = [];
            urlEndpointsCollection.each(function(endpoint) {
              var activeSnippets = endpoint.get("activeSnippets");
              activeSnippets.each(function(activeSnippet) {
                if (activeSnippet.get("snippet_id") == snippetToRemoveFromLanders.get("snippet_id")) {
                  tmpActiveSnippetsToRemove.push(activeSnippet);
                }
              });
            });

            if (tmpActiveSnippetsToRemove.length > 0) {
              //merge this landers active snippets into the main active snippets list
              $.merge(activeSnippetsToRemove, tmpActiveSnippetsToRemove);
              landersToRedeploy.push(landerModel);

              //need to set the deploy status here incase the view isn't currently showing
              //we will still update correctly for topbartotals
              // landerModel.set("deploy_status","deploying");
            }
          });

          //now we have a FULL list of active snippets and landers that we need to remove and redeploy
          if (activeSnippetsToRemove.length <= 0) {
            //none to remove!
            onSuccessCallback();
          } else {
            var activeSnippetsCounter = 0;
            $.each(activeSnippetsToRemove, function(idx, snippetToRemove) {
              snippetToRemove.destroy({
                success: function() {
                  activeSnippetsCounter++;
                  if (activeSnippetsCounter == activeSnippetsToRemove.length) {
                    //all snippets deleted! now redeploy all landers that need to be                  
                    me.redeployLanders(landersToRedeploy, function() {
                      onSuccessCallback();
                    });
                  }
                }
              });
            });
          }

        },

        saveLander: function(modelAttributes) {
          // gives redeployLanders an empty list [] which means we're just saving
          // and it will only save if its modified (handled on the server as well)
          var me = this;

          var landerModel = this.filteredCollection.get(modelAttributes.id);
          if (!landerModel) return false;

          this.redeployLanders(landerModel);

        },

        updateAllActiveSnippetNames: function(savedModel) {

          if (this.filteredCollection) {

            this.filteredCollection.original.each(function(landerModel) {

              var urlEndpointCollection = landerModel.get("urlEndpoints");
              urlEndpointCollection.each(function(endpoint) {

                var activeSnippetsCollection = endpoint.get("activeSnippets");
                activeSnippetsCollection.each(function(snippet) {
                  if (snippet.get("snippet_id") == savedModel.get("snippet_id")) {
                    snippet.set("name", savedModel.get("name"));
                  }
                });
              });
            });
          }
        },

        addNewDuplicatedLander: function(landerModel) {

          Landerds.trigger('landers:closesidebar');
          this.filteredCollection.add(landerModel);
          //1. goto page with new lander on it
          this.expandAndShowRow(landerModel);
        },

        deleteLander: function(model) {
          var lander_id = model.get("id");
          var landerModel = this.filteredCollection.original.get(lander_id);

          var deleteJobList = [{
            action: "deleteLander",
            lander_id: landerModel.get("id"),
            deploy_status: "deleting"
          }];

          var deleteJobModel = new JobModel({
            action: "deleteLander",
            list: deleteJobList,
            model: landerModel,
            neverAddToUpdater: true
          });

          var deleteJobAttributes = {
            jobModel: deleteJobModel,
            onSuccess: function(responseJobList) {

              if (responseJobList.length > 0) {
                var deleteLanderAttr = responseJobList[0];

                var jobModel = new JobModel(deleteLanderAttr);

                var activeJobCollection = landerModel.get("activeJobs");
                activeJobCollection.add(jobModel);

                Landerds.trigger("job:start", jobModel);
              }
            }
          };

          Landerds.trigger("job:start", deleteJobAttributes);

        }

      }, BaseListController);
    });

    return Landerds.LandersApp.Landers.List.Controller;
  });
