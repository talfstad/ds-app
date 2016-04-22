define(["app",
    "/assets/js/apps/moonlander/landers/list/views/list_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_collection.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/common/filtered_paginated/paginated_model.js",
    "/assets/js/common/filtered_paginated/paginated_button_view.js",
    "/assets/js/apps/moonlander/landers/list/views/topbar_view.js",
    "/assets/js/apps/moonlander/landers/list/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/list/views/domain_tab_handle_view.js",
    "/assets/js/apps/moonlander/landers/list/views/campaign_tab_handle_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed_domains/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/domains/dao/domain_collection.js",
    "/assets/js/apps/moonlander/landers/list/active_campaigns/views/active_campaigns_collection_view.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_domain_model.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_model.js",
    "/assets/js/apps/moonlander/landers/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, CampaignTabHandleView,
    DeployedDomainsView, DeployedDomainsCollection, ActiveCampaignsView, DeployedDomainModel,
    JobModel, ActiveCampaignModel) {
    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredLanderCollection: null,

        deployCampaignLandersToDomain: function(attr) {

          var activeCampaignModel = attr.active_campaign_model;
          var landerModel = attr.lander_model;

          if (!landerModel) {
            return false;
          }

          var activeCampaigns = landerModel.get("activeCampaigns");

          var campaign_id = activeCampaignModel.get("campaign_id");

          var activeCampaignModelActiveJobs = activeCampaignModel.get("activeJobs");

          var campaignLandersArr = activeCampaignModel.get("deployedDomains");

          var currentDeployedDomainCollection = landerModel.get("deployedDomains");
          var landersToDeploy = [];

          //loop current landers, see if its deployed, if not deploy
          $.each(campaignLandersArr, function(idx, campaignDomain) {

            var landerIsDeployed = false;

            currentDeployedDomainCollection.each(function(deployedDomainModel) {
              deployedDomainModelId = deployedDomainModel.get("domain_id") || deployedDomainModel.get("id")
              if (campaignDomain.domain_id == deployedDomainModelId) {
                deployedDomainModel.set("hasActiveCampaigns", true);
                landerIsDeployed = true;
              }
            });

            if (!landerIsDeployed) {
              var newDeployedDomainModel = new DeployedDomainModel(campaignDomain);
              newDeployedDomainModel.set("domain_id", newDeployedDomainModel.get("domain_id") || newDeployedDomainModel.get("id"));
              newDeployedDomainModel.unset("id");
              newDeployedDomainModel.set("hasActiveCampaigns", true);
              landersToDeploy.push(newDeployedDomainModel);
            }
          });

          //add the campaign to the list
          var domainModelActiveCampaignCollection = landerModel.get("activeCampaigns");
          domainModelActiveCampaignCollection.add(activeCampaignModel);

          if (landersToDeploy.length > 0) {
            activeCampaignModel.set("deploy_status", "deploying");

            $.each(landersToDeploy, function(idx, deployedDomainModelToDeploy) {

              var deployedDomainModelToDeployActiveJobs = deployedDomainModelToDeploy.get("activeJobs");

              //create deploy job for domain and add it to the domain and the lander model
              var jobAttributes = {
                action: "deployLanderToDomain",
                lander_id: landerModel.get("lander_id") || landerModel.get("id"),
                domain_id: deployedDomainModelToDeploy.get("domain_id") || deployedDomainModelToDeploy.get("id"),
                campaign_id: campaign_id,
                deploy_status: "deploying"
              };
              var jobModel = new JobModel(jobAttributes);

              deployedDomainModelToDeployActiveJobs.add(jobModel);
              activeCampaignModelActiveJobs.add(jobModel);

              //add deployed lander model to the list controller
              var domainModelDeployedLanderCollection = landerModel.get("deployedDomains");
              domainModelDeployedLanderCollection.add(deployedDomainModelToDeploy);

              Moonlander.trigger("job:start", jobModel);

            });
          }

        },


        removeSnippetFromAllLanders: function(attr) {
          var me = this;
          var snippetToRemoveFromLanders = attr.snippet;
          var onSuccessCallback = attr.onSuccess;

          //loop original lander collection to remove active snippet from all url endpoints
          var landersToRedeploy = [];
          var activeSnippetsToRemove = [];

          this.filteredLanderCollection.original.each(function(landerModel) {

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

        redeployLanders: function(landerModel) {
          //update the changed stuff in lander
          landerModel.save({}, {
            success: function(response) {
              if (response.error) {
                if (response.error.code == "InvalidDeploymentFolderInput") {
                  landerModel.set("deploymentFolderInvalid", true);
                } else {
                  //TODO add notification here error
                }
              } else {
                //get list of all deployedDomains first
                var deployedDomainsJobList = [];
                var deployedDomainCollection = landerModel.get("deployedDomains");

                //get list of all locations to 
                deployedDomainCollection.each(function(deployedDomain) {
                  deployedDomainsJobList.push({
                    lander_id: deployedDomain.get("lander_id"),
                    domain_id: deployedDomain.get("domain_id"),
                    action: "redeploy",
                    deploy_status: "redeploying"
                  });
                });

                if (deployedDomainsJobList.length > 0) {

                  var redeployJobModel = new JobModel({
                    action: "redeploy",
                    list: deployedDomainsJobList,
                    neverAddToUpdater: true
                  });
                  //create a list of redeploy jobs for each deployed domain
                  var redeployJobAttributes = {
                    jobModel: redeployJobModel,
                    onSuccess: function(responseJobList) {
                      //create job models for each deployed domain and add them!
                      deployedDomainCollection.each(function(deployedDomainModel) {
                        $.each(responseJobList, function(idx, responseJobAttr) {
                          if (deployedDomainModel.get("domain_id") == responseJobAttr.domain_id) {
                            //create new individual job model for
                            var activeJobs = deployedDomainModel.get("activeJobs");
                            var newRedeployJob = new JobModel(responseJobAttr)
                            activeJobs.add(newRedeployJob);
                            //call start for each job 
                            Moonlander.trigger("job:start", newRedeployJob);
                          }
                        });
                      });
                    }
                  };

                  Moonlander.trigger("job:start", redeployJobAttributes);

                }
              }
            }
          });

        },

        updateAllActiveSnippetNames: function(savedModel) {

          if (this.filteredLanderCollection) {

            this.filteredLanderCollection.original.each(function(landerModel) {

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

        showLanders: function(model) {
          //make layout for landers
          var me = this;
          var landersListLayout = new List.Layout();
          landersListLayout.render();

          Moonlander.rootRegion.currentView.mainContentRegion.show(landersListLayout);

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
          var deferredLandersCollection = Moonlander.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            me.filteredLanderCollection = FilteredPaginatedCollection({
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

            //make landers view and display data
            var landersListView = new ListView({
              collection: me.filteredLanderCollection
            });

            landersListLayout.on("landers:filterList", function(filterVal) {
              me.filteredLanderCollection.filter(filterVal);
            });

            landersListLayout.on("landers:sort", function() {
              landersListView.trigger("landers:sort");
            });

            landersListLayout.on("landers:changepagesize", function(pageSize) {
              me.filteredLanderCollection.setPageSize(pageSize);
            });

            if (landersListLayout.isRendered) {
              landersListLayout.landersCollectionRegion.show(landersListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredLanderCollection.state.gui
            });

            me.filteredLanderCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Moonlander.trigger('landers:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                landersListView.children.each(function(landerView) {

                  var domainTabHandleView = new DeployStatusView({
                    model: landerView.model
                  });

                  var campaignTabHandleView = new CampaignTabHandleView({
                    model: landerView.model
                  });

                  var activeCampaignsCollection = landerView.model.get("activeCampaigns");
                  //set landername to be used by campaign models dialog
                  activeCampaignsCollection.landerName = landerView.model.get("name");
                  activeCampaignsCollection.deploy_status = landerView.model.get("deploy_status");

                  var activeCampaignsView = new ActiveCampaignsView({
                    collection: activeCampaignsCollection
                  });

                  activeCampaignsCollection.on("showUndeployDomainFromCampaignDialog", function(campaignModel) {
                    var attr = {
                      campaign_model: campaignModel,
                      lander_model: landerView.model
                    };
                    Moonlander.trigger("landers:showUndeployDomainFromCampaignDialog", attr);
                  });

                  activeCampaignsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_campaigns_count", length);
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedDomains");

                  deployedDomainsCollection.activeCampaignCollection = activeCampaignsCollection;
                  deployedDomainsCollection.deployment_folder_name = landerView.model.get("deployment_folder_name");

                  //if this lander is initializing set the collection level variable to be picked up
                  //by collections childviewoptions
                  if (landerView.model.get("deploy_status") == "initializing") {
                    deployedDomainsCollection.isInitializing = true;
                  }

                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  deployedDomainsCollection.on("showRemoveDomain", function(domainModel) {
                    var attr = {
                      lander_model: landerView.model,
                      domain_model: domainModel
                    };
                    Moonlander.trigger("landers:showRemoveDomain", attr);
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


                  //update view information on model change
                  landerView.model.on("change:deploy_status", function() {
                    Moonlander.trigger("landers:updateTopbarTotals");

                    //if not deployed make sure that the deployed
                    if (this.get("deploy_status") == "not_deployed") {
                      deployedDomainsCollection.isInitializing = false;
                    }

                    // render if is showing AND EMPTY else dont (this logic meant for initializing state)
                    if (deployedDomainsView.isRendered && deployedDomainsCollection.length <= 0) {
                      deployedDomainsView.render();
                    }
                    if (activeCampaignsView.isRendered && activeCampaignsCollection.length <= 0) {
                      activeCampaignsView.render();
                    }

                    //if deleting then trigger delete state on landerView
                    if (landerView.isRendered && this.get("deploy_status") === "deleting") {
                      landerView.disableAccordionPermanently();
                      //close sidebar
                      Moonlander.trigger('landers:closesidebar');
                    }
                  });

                  landerView.model.on("change:modified", function() {
                    Moonlander.trigger("landers:updateTopbarTotals");

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


                  landerView.deploy_status_region.show(domainTabHandleView);
                  landerView.campaign_tab_handle_region.show(campaignTabHandleView);
                  landerView.deployed_domains_region.show(deployedDomainsView);
                  landerView.active_campaigns_region.show(activeCampaignsView);
                });
              }

              //set topbar totals on reset
              Moonlander.trigger("landers:updateTopbarTotals")
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredLanderCollection.state.gui
            });
            paginatedButtonView.on("firstPage", function(page) {
              me.filteredLanderCollection.getFirstPage();
            });
            paginatedButtonView.on("previousPage", function(page) {
              me.filteredLanderCollection.getPreviousPage();
            });
            paginatedButtonView.on("nextPage", function(page) {
              me.filteredLanderCollection.getNextPage();
            });
            paginatedButtonView.on("lastPage", function(page) {
              me.filteredLanderCollection.getLastPage();
            });
            paginatedButtonView.on("gotoPage", function(page) {
              me.filteredLanderCollection.gotoPage(page);
            });

            if (landersListLayout.isRendered) {
              landersListLayout.footerRegion.show(paginatedButtonView);
              landersListLayout.topbarRegion.show(topbarView);
            }


            var filterVal = $(".lander-search").val() || "";
            me.filteredLanderCollection.filter(filterVal);
          });
        },

        //take a landerID and domainID and deploy the domain
        //to that lander by adding it to the collection. This triggers
        //a new job to be created, etc.
        // lander = optional!
        deployLanderToDomain: function(modelAttributes) {
          var me = this;

          modelAttributes.deploy_status = "deploying";

          //any campaign triggered deploy will include a campaign_id
          var campaign_id = modelAttributes.campaign_id;

          var domainModel = modelAttributes.domain_model;
          if (!domainModel) {
            domainModel = this.filteredLanderCollection.get(modelAttributes.lander_id);
          }
          if (!domainModel) return false;

          //create active job model to deploy this lander to a domain
          var jobAttr = {
            action: "deployLanderToDomain",
            lander_id: modelAttributes.lander_id,
            domain_id: modelAttributes.domain_id,
            campaign_id: campaign_id,
            deploy_status: "deploying",
          };
          
          var deployJobModel = new JobModel(jobAttr);

          var jobStartAttributes = {
            jobModel: deployJobModel,
            onSuccess: function(response) {
              //use the callback here to set deployedDomain's ID

              var deployedDomains = domainModel.get("deployedDomains");

              //search deployedDomains for the domain_id if found use that
              var existingDeployedDomainModel = null;
              deployedDomains.each(function(deployedDomain) {
                if (deployedDomain.get("domain_id") == modelAttributes.domain_id) {
                  existingDeployedDomainModel = deployedDomain;
                }
              });

              if (existingDeployedDomainModel) {
                var activeJobs = existingDeployedDomainModel.get("activeJobs");
                activeJobs.add(deployJobModel);
              } else {
                modelAttributes.id = response.deployed_domain_id;
                //create the deployed location model
                var deployedDomainModel = new DeployedDomainModel(modelAttributes);
                var activeJobs = deployedDomainModel.get("activeJobs");
                activeJobs.add(deployJobModel);
                deployedDomains.add(deployedDomainModel);
              }
            }
          }

          Moonlander.trigger("job:start", jobStartAttributes);
        },


        //add the lander model to the list
        addLander: function(landerModel) {
          Moonlander.trigger('landers:closesidebar');
          this.filteredLanderCollection.add(landerModel);
          //1. goto page with new lander on it
          this.filteredLanderCollection.showPageWithModel(landerModel);
          //2. expand new lander
          landerModel.trigger("view:expand");
        },

        addNewDuplicatedLander: function(landerModel) {

          Moonlander.trigger('landers:closesidebar');
          this.filteredLanderCollection.add(landerModel);
          //1. goto page with new lander on it
          this.filteredLanderCollection.showPageWithModel(landerModel);
          //2. expand new lander
          landerModel.trigger("view:expand");

        },

        deleteLander: function(model) {
          var lander_id = model.get("id");
          var landerModel = this.filteredLanderCollection.get(lander_id);

          //model is a clone not 'the' model in filtered collection
          // var filteredCollectionLanderModel = this.filteredLanderCollection.get(model.get("id"));
          // filteredCollectionLanderModel.set("deploy_status", "deleting");

          var jobAttributes = {
            action: "deleteLander",
            lander_id: landerModel.get("id"),
            deploy_status: "deleting"
          };

          var jobModel = new JobModel(jobAttributes);

          var activeJobCollection = landerModel.get("activeJobs");
          activeJobCollection.add(jobModel);
          Moonlander.trigger("job:start", jobModel);


        },

        updateTopbarTotals: function() {
          if (this.filteredLanderCollection) {
            this.filteredLanderCollection.updateTotals();
          }
        }
      }
    });

    return Moonlander.LandersApp.Landers.List.Controller;
  });
