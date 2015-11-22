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
    "/assets/js/apps/moonlander/landers/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, LanderCollection, FilteredPaginatedCollection,
    PaginatedButtonView, TopbarView, LoadingView, DeployStatusView, CampaignTabHandleView,
    DeployedDomainsView, DeployedDomainsCollection, ActiveCampaignsView, DeployedLocationModel,
    JobModel, DeployStatusModel, ActiveCampaignModel) {
    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredLanderCollection: null,

        showLanders: function() {
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
            // landersListView.on("childview:updateCollectionTotals", function(){
            //   me.filteredLanderCollection.updateTotals();
            // });

            me.filteredLanderCollection.on("reset", function(collection) {

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
                  activeCampaignsCollection.deployStatus = landerView.model.get("deploy_status");

                  var activeCampaignsView = new ActiveCampaignsView({
                    collection: activeCampaignsCollection
                  })

                  activeCampaignsView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_campaigns_count", length);
                  });

                  var deployedDomainsCollection = landerView.model.get("deployedLocations");

                  deployedDomainsCollection.deployStatus = landerView.model.get("deploy_status");


                  deployedDomainsCollection.on("destroy", function() {
                    deployedDomainsView.trigger("childview:updateParentLayout");
                  });


                  var deployedDomainsView = new DeployedDomainsView({
                    collection: deployedDomainsCollection
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedDomainsView.on("childview:selectCampaignTab", function(one, two, three) {
                    landerView.$el.find("a[href=#campaigns-tab-id-" + landerView.model.get("id") + "]").tab('show')
                  });

                  //add events before show!
                  //update the landerView layout with whatever the child has
                  deployedDomainsView.on("childview:updateParentLayout", function(childView, notDeployed, three) {
                    //update deploy status view UNLESS we're initializing. if initializing needs to be changed
                    //to not_deployed by the lander job itself because we're adding a new lander. this logic is
                    //for when the lander is already added
                    if (landerView.model.get("deploy_status") !== "initializing") {
                      var deployStatus = "deployed";
                      this.children.each(function(deployedDomainView) {
                        if (deployedDomainView.model.get("activeJobs")) {
                          if (deployedDomainView.model.get("activeJobs").length > 0) {
                            deployStatus = "deploying";
                          }
                        }
                        //active jobs is totally undefined then we're showing the empty view
                        else if (!deployedDomainView.model.get("activeJobs")) {
                          deployStatus = "not_deployed";
                        }
                        //empty view passes not_deployed in as its arg
                        // else if(notDeployed === "not_deployed") {
                        //   deployStatus = "not_deployed";
                        // }
                      });
                      landerView.model.set("deploy_status", deployStatus);
                    }
                  });

                  //update deployStatusView to show not deployed (initial adding, no way it can be deployed yet)
                  // landerView.model.on("finishedInitialization", function(){
                    
                  // });

                  //whenever the deployed status view is updated update deployed totals
                  //this should be rendered whenever there is a change to the landers deployed status
                  deployStatusView.on("render", function() {
                    filteredCollection.updateTotals();
                  });

                  landerView.deploy_status_region.show(deployStatusView);
                  landerView.campaign_tab_handle_region.show(campaignTabHandleView);
                  landerView.deployed_domains_region.show(deployedDomainsView);
                  landerView.active_campaigns_region.show(activeCampaignsView);
                });
              }
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredLanderCollection.state.gui
            });
            paginatedButtonView.on("landers:firstPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              me.filteredLanderCollection.getFirstPage();
            });
            paginatedButtonView.on("landers:previousPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              me.filteredLanderCollection.getPreviousPage();
            });
            paginatedButtonView.on("landers:nextPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              me.filteredLanderCollection.getNextPage();
            });
            paginatedButtonView.on("landers:lastPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              me.filteredLanderCollection.getLastPage();
            });
            paginatedButtonView.on("landers:gotoPage", function(page) {
              Moonlander.trigger('landers:closesidebar');
              me.filteredLanderCollection.gotoPage(page);
            });

            landersListLayout.footerRegion.show(paginatedButtonView);


            landersListLayout.topbarRegion.show(topbarView);


            me.filteredLanderCollection.filter("");
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

          //can pass lander optional
          var landerModel = modelAttributes.lander_model;
          if (!landerModel) {
            landerModel = this.filteredLanderCollection.get(modelAttributes.lander_id);
          }
          if (!landerModel) return false;

          //create the deployed location model
          var domainModel = new DeployedLocationModel(modelAttributes);

          var activeJobs = domainModel.get("activeJobs");

          activeJobs.add(jobModel);
          Moonlander.trigger("job:start", jobModel);

          var deployedLocations = landerModel.get("deployedLocations");
          deployedLocations.add(domainModel);

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
          this.filteredLanderCollection.add(landerModel);
          this.filteredLanderCollection.resetWithOriginals();
        }
      }
    });

    return Moonlander.LandersApp.Landers.List.Controller;
  });
