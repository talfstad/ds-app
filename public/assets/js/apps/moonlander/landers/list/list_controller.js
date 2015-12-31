define(["app",
    "/assets/js/apps/moonlander/landers/list/views/list_view.js",
    "/assets/js/apps/moonlander/landers/dao/lander_collection.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/common/filtered_paginated/paginated_button_view.js",
    "/assets/js/apps/moonlander/landers/list/views/topbar_view.js",
    "/assets/js/apps/moonlander/landers/list/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/list/views/deploy_status_view.js",
    "/assets/js/apps/moonlander/landers/list/views/campaign_tab_handle_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/deployed_domains_collection_view.js",
    "/assets/js/apps/moonlander/domains/dao/domain_collection.js",
    "/assets/js/apps/moonlander/landers/list/active_campaigns/views/active_campaigns_collection_view.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_model.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/landers/dao/deploy_status_model.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_model.js",
    "/assets/js/apps/moonlander/landers/list/views/deploy_to_new_domain_view.js",
    "/assets/js/apps/moonlander/landers/list/views/add_to_new_campaign_view.js",
    "/assets/js/apps/moonlander/landers/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, LanderCollection, FilteredPaginatedCollection,
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, CampaignTabHandleView,
    DeployedDomainsView, DeployedDomainsCollection, ActiveCampaignsView, DeployedLocationModel,
    JobModel, DeployStatusModel, ActiveCampaignModel, DeployToNewDomainView, AddToNewCampaignView) {
    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredLanderCollection: null,

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
            }
          });

          //now we have a FULL list of active snippets and landers that we need to remove and redeploy
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

        },

        //creates an undeploy job and a deploy job and starts them for each lander in the list
        //you pass in
        redeployLanders: function(landerModelsArray, callback) {
          //redeploy landers and call the callback when ALL jobs have been started!

          $.each(landerModelsArray, function(idx, landerModel) {

            //create a job to undeploy and redeploy for each deployed location
            //and start the jobs


          });

          //call this once everything has been guaranteed started for every lander
          callback();

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
                    // || lander.get('last_updated').toLowerCase().indexOf(criterion) !== -1) {
                    // || lander.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1){
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

            landersListLayout.landersCollectionRegion.show(landersListView);

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredLanderCollection.state.gui
            });

            //these lines only if we're rendering children not in reset...
            landersListView.on("childview:updateCollectionTotals", function() {
              me.filteredLanderCollection.updateTotals();
            });

            me.filteredLanderCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Moonlander.trigger('landers:closesidebar');

              var filteredCollection = this;

              if (this.length > 0) {
                landersListView.children.each(function(landerView) {

                  var deployStatusView = new DeployStatusView({
                    // model: new DeployStatusModel({
                    //   id: landerView.model.get("id"),
                    //   deploy_status: landerView.model.get("deploy_status")
                    // })
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

                  activeCampaignsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_campaigns_count", length);
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedLocations");

                  deployedDomainsCollection.deploy_status = landerView.model.get("deploy_status");


                  deployedDomainsCollection.on("destroy", function() {
                    deployedDomainsView.trigger("childview:updateParentLayout");
                  });

                  var deployToNewDomainView = new DeployToNewDomainView({
                    model: landerView.model
                  });

                  var addToNewCampaignView = new AddToNewCampaignView({
                    model: landerView.model
                  })

                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedDomainsView.on("childview:selectCampaignTab", function(one, two, three) {
                    landerView.$el.find("a[href=#campaigns-tab-id-" + landerView.model.get("id") + "]").tab('show')
                  });


                  //update view information on model change
                  landerView.model.on("change:deploy_status", function() {
                    Moonlander.trigger("landers:updateTopbarTotals")

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




                  landerView.deploy_status_region.show(deployStatusView);
                  landerView.campaign_tab_handle_region.show(campaignTabHandleView);
                  landerView.deployed_domains_region.show(deployedDomainsView);
                  landerView.active_campaigns_region.show(activeCampaignsView);
                  landerView.deploy_to_new_domain_region.show(deployToNewDomainView);
                  landerView.add_to_new_campaign_region.show(addToNewCampaignView);
                });
              }

              //set topbar totals on reset
              Moonlander.trigger("landers:updateTopbarTotals")
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredLanderCollection.state.gui
            });
            paginatedButtonView.on("landers:firstPage", function(page) {
              me.filteredLanderCollection.getFirstPage();
            });
            paginatedButtonView.on("landers:previousPage", function(page) {
              me.filteredLanderCollection.getPreviousPage();
            });
            paginatedButtonView.on("landers:nextPage", function(page) {
              me.filteredLanderCollection.getNextPage();
            });
            paginatedButtonView.on("landers:lastPage", function(page) {
              me.filteredLanderCollection.getLastPage();
            });
            paginatedButtonView.on("landers:gotoPage", function(page) {
              me.filteredLanderCollection.gotoPage(page);
            });

            landersListLayout.footerRegion.show(paginatedButtonView);


            landersListLayout.topbarRegion.show(topbarView);

            var filterVal = $(".lander-search").val() || "";
            me.filteredLanderCollection.filter(filterVal);
          });
        },

        //take a landerID and domainID and deploy the domain
        //to that lander by adding it to the collection. This triggers
        //a new job to be created, etc.
        // lander = optional!
        deployLanderToDomain: function(modelAttributes) {
          //we're deploying!
          modelAttributes.deploy_status = "deploying";

          //create active job model to deploy this lander to a domain
          var jobAttributes = {
            action: "deployLanderToDomain",
            lander_id: modelAttributes.lander_id,
            domain_id: modelAttributes.id,
          }

          //create job and add to models activeJobs
          var jobModel = new JobModel(jobAttributes);

          var landerModel = modelAttributes.lander_model;
          if (!landerModel) {
            landerModel = this.filteredLanderCollection.get(modelAttributes.lander_id);
          }
          if (!landerModel) return false;

          //check if this domain_id is already there, if it is instead of adding a new domain_model
          //just add this job to it

          var deployedLocations = landerModel.get("deployedLocations");

          //search deployedlocations for the domain_id if found use that
          var existingDeployedLocationModel = null;
          deployedLocations.each(function(location) {
            if (location.get("id") == modelAttributes.id) {
              existingDeployedLocationModel = location;
            }
          });

          if (existingDeployedLocationModel) {
            var activeJobs = existingDeployedLocationModel.get("activeJobs");
            activeJobs.add(jobModel);
          } else {

            //create the deployed location model
            var domainModel = new DeployedLocationModel(modelAttributes);
            var activeJobs = domainModel.get("activeJobs");
            activeJobs.add(jobModel);
            deployedLocations.add(domainModel);
          }

          Moonlander.trigger("job:start", jobModel);



        },

        addCampaignToLander: function(modelAttributes) {
          var me = this;
          var addedCampaignSuccessCallback = function(activeCampaignModel) {
            // add the model to collection
            var lander = me.filteredLanderCollection.get(modelAttributes.lander_id);

            var activeCampaignsCollection = lander.get("activeCampaigns");
            activeCampaignsCollection.add(activeCampaignModel);

            var deployedLocations = lander.get("deployedLocations");

            //add the model to the attachedCampaigns for the campaigns currentDomains
            $.each(activeCampaignModel.get("currentDomains"), function(idx, domain) {
              var domain_id = domain.domain_id;

              var deployedDomainModel = deployedLocations.get(domain_id);

              var attachedCampaigns = deployedDomainModel.get("attachedCampaigns");
              attachedCampaigns.add(activeCampaignModel);

            });


          };
          var addedCampaignErrorCallback = function() {

          };
          //add the campaign to the lander first, on success close dialog
          var campaignModel = new ActiveCampaignModel(modelAttributes);

          // create the model for activeCampaign model. make sure it saves to
          // /api/active_campaigns
          campaignModel.save({}, {
            success: addedCampaignSuccessCallback,
            error: addedCampaignErrorCallback
          })

        },

        //takes an array of objects, keys off domain_id to undeploy each domain
        removeCampaignFromLander: function(campaignModel) {
          var me = this;
          var lander_id = campaignModel.get("lander_id");

          var lander = me.filteredLanderCollection.get(lander_id);
          var deployedLocations = lander.get("deployedLocations");


          //trigger undeploy job on each deployed domain that belongs to this campaign
          $.each(campaignModel.get("currentDomains"), function(idx, domain) {
            var domain_id = domain.domain_id;

            var deployedDomainModel = deployedLocations.get(domain_id);
            var activeJobsCollection = deployedDomainModel.get("activeJobs");


            var jobAttributes = {
              action: "undeployLanderFromDomain",
              lander_id: lander_id,
              domain_id: domain_id,
            }

            //create job and add to models activeJobs

            //get lander so we can add jobs to the deployed domains we want to undeploy

            //only undeploy lander if this is the only campaign attached to the domain
            var attachedCampaigns = deployedDomainModel.get("attachedCampaigns");
            if (attachedCampaigns.length <= 0) {
              //create the new job model
              var jobModel = new JobModel(jobAttributes);
              activeJobsCollection.add(jobModel);

              Moonlander.trigger("job:start", jobModel);

            }

          });

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
            lander_id: landerModel.get("id")
          }
          var jobModel = new JobModel(jobAttributes);

          var activeJobCollection = landerModel.get("activeJobs");
          activeJobCollection.add(jobModel);
          Moonlander.trigger("job:start", jobModel);


        },

        updateTopbarTotals: function() {
          this.filteredLanderCollection.updateTotals();
        }
      }
    });

    return Moonlander.LandersApp.Landers.List.Controller;
  });
