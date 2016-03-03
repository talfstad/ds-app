define(["app",
    "/assets/js/apps/moonlander/campaigns/list/views/list_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/domain_collection.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/common/filtered_paginated/paginated_model.js",
    "/assets/js/common/filtered_paginated/paginated_button_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/topbar_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/loading_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/lander_tab_handle_view.js",
    "/assets/js/apps/moonlander/campaigns/list/views/campaign_tab_handle_view.js",
    "/assets/js/apps/moonlander/campaigns/list/deployed_landers/views/deployed_landers_collection_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/domain_collection.js",
    "/assets/js/apps/moonlander/campaigns/list/active_campaigns/views/active_campaigns_collection_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_lander_model.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/campaigns/dao/active_campaign_model.js",
    "/assets/js/apps/moonlander/campaigns/list/views/list_layout_view.js"
  ],
  function(Moonlander, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, CampaignTabHandleView,
    DeployedLandersView, DeployedDomainsCollection, ActiveCampaignsView, DeployedLanderModel,
    JobModel, ActiveCampaignModel) {
    Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredCampaignCollection: null,

        //takes an array of objects, keys off domain_id to undeploy each domain
        removeCampaignFromLander: function(campaignModel) {
          var me = this;
          var domain_id = campaignModel.get("domain_id");

          var domain = me.filteredCampaignCollection.get(domain_id);
          var deployedLanders = domain.get("deployedLanders");


          //trigger undeploy job on each deployed domain that belongs to this campaign
          $.each(campaignModel.get("currentLanders"), function(idx, lander) {
            var lander_id = lander.lander_id || lander.id;

            var deployedLanderModel = deployedLanders.find(function(m) {
              var id = m.get("lander_id") || m.get("id");
              return id == lander_id
            })

            var activeJobsCollection = deployedLanderModel.get("activeJobs");


            var jobAttributes = {
              action: "undeployLanderFromDomain",
              lander_id: lander_id,
              domain_id: domain_id,
            }

            //create job and add to models activeJobs

            //get lander so we can add jobs to the deployed domains we want to undeploy

            //only undeploy lander if this is the only campaign attached to the domain
            var attachedCampaigns = deployedLanderModel.get("attachedCampaigns");
            if (attachedCampaigns.length <= 0) {
              //create the new job model
              var jobModel = new JobModel(jobAttributes);
              activeJobsCollection.add(jobModel);

              Moonlander.trigger("job:start", jobModel);

            }

          });

        },

        addCampaignToDomain: function(modelAttributes) {
          var me = this;
          var addedCampaignSuccessCallback = function(activeCampaignModel) {
            // add the model to collection
            var domain = me.filteredCampaignCollection.get(modelAttributes.domain_id);

            var activeCampaignsCollection = domain.get("activeCampaigns");
            activeCampaignsCollection.add(activeCampaignModel);

            var deployedLanders = domain.get("deployedLanders");
            var currentLanders = activeCampaignModel.get("currentLanders");

            $.each(currentLanders, function(idx, lander) {
              var lander_id = lander.lander_id || lander.id;

              var deployedLanderModel = deployedLanders.find(function(m) {
                var id = m.get("lander_id") || m.get("id");
                return id == lander_id
              });

              var attachedCampaigns = deployedLanderModel.get("attachedCampaigns");
              attachedCampaigns.add(activeCampaignModel);

            });
          };


          var addedCampaignErrorCallback = function() {

          };

          //make sure we know its add to camp to domain and not lander to camp
          modelAttributes.action = "addToDomain";

          //add the campaign to the domain first, on success close dialog
          var campaignModel = new ActiveCampaignModel(modelAttributes);

          // create the model for activeCampaign model. make sure it saves to
          // /api/active_campaigns
          campaignModel.save({}, {
            success: addedCampaignSuccessCallback,
            error: addedCampaignErrorCallback
          })

        },

        //create new deploy job for lander attach it to domain
        deployNewLander: function(modelAttributes) {
          //we're deploying!
          var landerAttributes = modelAttributes.landerAttributes;

          //domainModel NEEDS to be passed by any models calling deployNewLander because it's
          //during creation time before filteredCampaignCollection is created
          var domainModel = modelAttributes.domain_model;

          //need lander model
          if (!landerAttributes) {
            return false;
          }

          landerAttributes.deploy_status = "deploying";

          //create active job model to deploy this lander to a domain
          var jobAttributes = {
            action: "deployLanderToDomain",
            lander_id: landerAttributes.lander_id || landerAttributes.id,
            domain_id: modelAttributes.domain_id,
          };

          //create job and add to models activeJobs
          var jobModel = new JobModel(jobAttributes);

          if (!domainModel) {
            var domainModel = this.filteredCampaignCollection.get(modelAttributes.domain_id);
          }

          if (!domainModel) return false;

          //check if this domain_id is already there, if it is instead of adding a new domain_model
          //just add this job to it

          var deployedLanders = domainModel.get("deployedLanders");

          //search deployedlanders for the domain_id if found use that
          var existingLanderModel = null;
          deployedLanders.each(function(deployedLander) {
            if (deployedLander.get("lander_id") == landerAttributes.id) {
              existingLanderModel = deployedLander;
            }
          });

          if (existingLanderModel) {
            var activeJobs = existingLanderModel.get("activeJobs");
            activeJobs.add(jobModel);
          } else {
            //create the deployed lander model
            var landerModel = new DeployedLanderModel(landerAttributes);
            var activeJobs = landerModel.get("activeJobs");
            activeJobs.add(jobModel);
            deployedLanders.add(landerModel);
          }

          //set new lander to deploying by default
          Moonlander.trigger("job:start", jobModel);

        },

        //creates an undeploy job and a deploy job and starts them for each lander in the list
        //you pass in
        redeployLanders: function(landerModelsArray, doneAddingAllRedeployJobsToAllLandersCallback) {

          //redeploy landers and call the callback when ALL jobs have been started!
          var startRedeployJobs = function(deployedLocation, successCallback) {
            var activeJobCollection = deployedLocation.get("activeJobs");
            //create undeploy job, on callback success started call start deploy job on callback call success
            var undeployAttr = {
              lander_id: deployedLocation.get("lander_id"),
              domain_id: deployedLocation.get("id"),
              action: "undeployLanderFromDomain"
            }

            //create job and add to models activeJobs
            var undeployJobModel = new JobModel(undeployAttr);
            activeJobCollection.add(undeployJobModel);

            var undeployStartingAttr = {
              jobModel: undeployJobModel,
              onSuccess: function() {
                //successfully added undeploy job now lets add deploy job
                var deployAttr = {
                  lander_id: deployedLocation.get("lander_id"),
                  domain_id: deployedLocation.get("id"),
                  action: "deployLanderToDomain"
                }

                //create job and add to models activeJobs
                var deployJobModel = new JobModel(deployAttr);
                activeJobCollection.add(deployJobModel);

                var deployStartingAttr = {
                  jobModel: deployJobModel,
                  onSuccess: function() {
                    //successfully added the deploy job now we're good!
                    successCallback();
                  }
                }
                Moonlander.trigger("job:start", deployStartingAttr);
              }
            }
            Moonlander.trigger("job:start", undeployStartingAttr);
          };

          //get list of all deployedlocations first
          var deployedLocationsList = [];
          $.each(landerModelsArray, function(idx, landerModel) {
            //get list of all locations to 
            var deployedLocationCollection = landerModel.get("deployedLocations");
            deployedLocationCollection.each(function(deployedLocation) {
              deployedLocationsList.push(deployedLocation);
            });
          });

          //now i have the list, start the jobs for each, when completed call the
          //callback
          if (deployedLocationsList.length <= 0) {
            //nothing to redeploy
            doneAddingAllRedeployJobsToAllLandersCallback();
          } else {
            var deployedLocationsCount = 0;
            $.each(deployedLocationsList, function(idx, deployedLocation) {
              //create undeploy job
              startRedeployJobs(deployedLocation, function() {
                deployedLocationsCount++;

                //if we're equal then we're done all jobs have finished async
                if (deployedLocationsCount == deployedLocationsList.length) {
                  //call this once everything has been guaranteed started for every lander
                  doneAddingAllRedeployJobsToAllLandersCallback();
                }
              });
            });
          }

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
                campaignsListView.children.each(function(domainView) {

                  var landerTabHandleView = new LanderTabHandleView({
                    model: domainView.model
                  });

                  var campaignTabHandleView = new CampaignTabHandleView({
                    model: domainView.model
                  });

                  var activeCampaignsCollection = domainView.model.get("activeCampaigns");
                  //set landername to be used by campaign models dialog
                  activeCampaignsCollection.domain = domainView.model.get("domain");
                  activeCampaignsCollection.deploy_status = domainView.model.get("deploy_status");

                  var activeCampaignsView = new ActiveCampaignsView({
                    collection: activeCampaignsCollection
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


                  var deployedLandersView = new DeployedLandersView({
                    collection: deployedLandersCollection
                  });

                  deployedLandersView.on("childview:updateParentLayout", function(childView, options) {
                    //update the campaign count for lander
                    var length = this.children.length;
                    if (childView.isDestroyed) --length;
                    campaignTabHandleView.model.set("active_landers_count", length);
                    domainView.reAlignTableHeader();
                  });

                  //when campaign link selected go to camp tab (this is from deployed domains campaign name link)
                  deployedLandersView.on("childview:selectCampaignTab", function(one, two, three) {
                    domainView.$el.find("a[href=#campaigns-tab-id-" + domainView.model.get("id") + "]").tab('show')
                  });

                  landerTabHandleView.on("reAlignHeader", function() {
                    domainView.reAlignTableHeader();
                  });


                  //update view information on model change
                  domainView.model.on("change:deploy_status", function() {
                    Moonlander.trigger("campaigns:updateTopbarTotals");

                    //if not deployed make sure that the deployed
                    if (this.get("deploy_status") == "not_deployed") {
                      deployedLandersCollection.isInitializing = false;
                    }

                    // render if is showing AND EMPTY else dont (this logic meant for initializing state)
                    if (deployedLandersView.isRendered && deployedLandersCollection.length <= 0) {
                      deployedLandersView.render();
                    }
                    if (activeCampaignsView.isRendered && activeCampaignsCollection.length <= 0) {
                      activeCampaignsView.render();
                    }

                    //if deleting then trigger delete state on domainView
                    if (domainView.isRendered && this.get("deploy_status") === "deleting") {
                      domainView.disableAccordionPermanently();
                      //close sidebar
                      Moonlander.trigger('campaigns:closesidebar');

                    }
                  });


                  domainView.lander_tab_handle_region.show(landerTabHandleView);
                  domainView.campaign_tab_handle_region.show(campaignTabHandleView);
                  domainView.deployed_domains_region.show(deployedLandersView);
                  domainView.active_campaigns_region.show(activeCampaignsView);
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

        //add the lander model to the list
        addDomain: function(domainModel) {
          Moonlander.trigger('campaigns:closesidebar');
          this.filteredCampaignCollection.add(domainModel);
          //1. goto page with new lander on it
          this.filteredCampaignCollection.showPageWithModel(domainModel);
          //2. expand new lander
          domainModel.trigger("view:expand");
        },

        //remove the domain from the landers list by starting a delete job!
        deleteDomain: function(model) {
          var domain_id = model.get("id");
          var domainModel = this.filteredCampaignCollection.get(domain_id);

          var jobAttributes = {
            action: "deleteDomain",
            domain_id: domainModel.get("id")
          }
          var jobModel = new JobModel(jobAttributes);

          var activeJobCollection = domainModel.get("activeJobs");
          activeJobCollection.add(jobModel);
          Moonlander.trigger("job:start", jobModel);

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




//also needs to return all domain information (insteaed of campaignsDomainIds) and all lander information

//TODO change the /api/campaigns to return this, and stuff should still just work

// [{
//   "id": 1,
//   "name": "default",
//   "created_on": "",
//   //change to campaignsDomains from campaignsDomainIds
//   "deployedDomains": [{
//     "id": 127,
//     "domain": "ninedomain.com",
//     "activeJobs": [] <-- includes any landers that are deploying to this domain and belong to this campaign
//   }],
//   //add campaignsLanders
//   "deployedLanders": [{
//     "id": 251,
//     "name": "why why why",
//     "urlEndpoints": [],
//     "activeJobs": [] <- include any domains that are deploying to this lander and belong to this campaign
//   }]
// }]


//add lander to camp
// -- add job to lander to say its deploying to all the domains in campaign
//    -- active job added for each domain that lander needs to deploy to

// get all jobs with that lander on that campaign

//add domain to camp
// -- add job to domain to say landers in campaign are all deploying to domain
//    -- active job added for each lander that needs to deploy to domain 

// get all jobs with that domain on that campaign


//TODO: any campaign triggered deploy jobs need to include a campaign id in the job



