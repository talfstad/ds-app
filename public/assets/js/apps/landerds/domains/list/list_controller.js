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
    "assets/js/apps/help/help_app",
    "assets/js/apps/landerds/domains/list/views/list_layout_view"
  ],
  function(Landerds, ListView, LanderCollection, FilteredPaginatedCollection, PaginatedModel,
    PaginatedButtonView, TopbarView, LoadingView, LanderTabHandleView, CampaignTabHandleView,
    DeployedLandersView, DeployedDomainsCollection, ActiveCampaignsView, DeployedLanderModel,
    JobModel, ActiveCampaignModel, Notification) {
    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.Controller = {

        filteredDomainCollection: null,

        deployCampaignLandersToDomain: function(attr) {

          var activeCampaignModel = attr.active_campaign_model;
          var domainModel = attr.domain_model;

          if (!domainModel) {
            return false;
          }

          var activeCampaigns = domainModel.get("activeCampaigns");

          var campaign_id = activeCampaignModel.get("campaign_id");

          var activeCampaignModelActiveJobs = activeCampaignModel.get("activeJobs");

          var campaignLandersArr = activeCampaignModel.get("deployedLanders");

          var currentDeployedLanderCollection = domainModel.get("deployedLanders");
          var landersToDeploy = [];

          //loop current landers, see if its deployed, if not deploy
          $.each(campaignLandersArr, function(idx, campaignLander) {

            var landerIsDeployed = false;

            currentDeployedLanderCollection.each(function(deployedLanderModel) {
              deployedLanderModelId = deployedLanderModel.get("lander_id") || deployedLanderModel.get("id")
              if (campaignLander.id == deployedLanderModelId) {
                deployedLanderModel.set("hasActiveCampaigns", true);
                landerIsDeployed = true;
              }
            });

            if (!landerIsDeployed) {
              var newDeployedLanderModel = new DeployedLanderModel(campaignLander);
              newDeployedLanderModel.set("lander_id", newDeployedLanderModel.get("id"));
              newDeployedLanderModel.unset("id");
              newDeployedLanderModel.set("hasActiveCampaigns", true);
              landersToDeploy.push(newDeployedLanderModel);
            }
          });

          //add the campaign to the list
          var domainModelActiveCampaignCollection = domainModel.get("activeCampaigns");
          domainModelActiveCampaignCollection.add(activeCampaignModel);

          if (landersToDeploy.length > 0) {

            //notification that deployment may take up to 20 minutes
            if (landersToDeploy.length > 1) {
              Notification("Deploying Landing Pages", "May take up to 20 minutes", "success", "stack_top_right");
            } else {
              Notification("Deploying Landing Page", "May take up to 20 minutes", "success", "stack_top_right");
            }

            activeCampaignModel.set("deploy_status", "deploying");

            $.each(landersToDeploy, function(idx, deployedLanderModelToDeploy) {

              var deployedLanderModelToDeployActiveJobs = deployedLanderModelToDeploy.get("activeJobs");

              //create deploy job for domain and add it to the domain and the lander model
              var jobAttributes = {
                action: "deployLanderToDomain",
                lander_id: deployedLanderModelToDeploy.get("lander_id") || deployedLanderModelToDeploy.get("id"),
                domain_id: domainModel.get("id") || domainModel.get("domain_id"),
                campaign_id: campaign_id,
                deploy_status: "deploying"
              };
              var jobModel = new JobModel(jobAttributes);

              deployedLanderModelToDeployActiveJobs.add(jobModel);
              activeCampaignModelActiveJobs.add(jobModel);

              //add deployed lander model to the list controller
              var domainModelDeployedLanderCollection = domainModel.get("deployedLanders");
              domainModelDeployedLanderCollection.add(deployedLanderModelToDeploy);

              Landerds.trigger("job:start", jobModel);

            });
          }

        },

        //create new deploy job for lander attach it to domain
        deployNewLander: function(modelAttributes) {
          //we're deploying!
          var landerAttributes = modelAttributes.landerAttributes;

          //domainModel NEEDS to be passed by any models calling deployNewLander because it's
          //during creation time before filteredDomainCollection is created
          var domainModel = modelAttributes.domain_model;
          var campaignModel = modelAttributes.campaign_model;
          //need lander model
          if (!landerAttributes) {
            return false;
          }

          landerAttributes.deploy_status = "deploying";


          //any campaign triggered deploy will include a campaign_id
          var campaign_id;
          if (campaignModel) {
            campaign_id = campaignModel.get("campaign_id") || campaignModel.get("id");
          }


          //create active job model to deploy this lander to a domain
          var jobAttributes = {
            action: "deployLanderToDomain",
            lander_id: landerAttributes.lander_id || landerAttributes.id,
            domain_id: modelAttributes.domain_id,
            campaign_id: campaign_id,
            deploy_status: "deploying"
          };

          //create job and add to models activeJobs
          var jobModel = new JobModel(jobAttributes);

          if (!domainModel) {
            var domainModel = this.filteredDomainCollection.get(modelAttributes.domain_id);
          }

          if (!domainModel) return false;

          //show undeploying/deploying for campaign
          if (campaignModel) {
            var campaignActiveJobs = campaignModel.get("activeJobs");
            campaignActiveJobs.add(jobModel);
          }

          //check if this domain_id is already there, if it is instead of adding a new domain_model
          //just add this job to it

          var deployedLanders = domainModel.get("deployedLanders");

          //search deployedlanders for the domain_id if found use that. this is for if you add campaign before
          //some landers are done dpeloying
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
          Landerds.trigger("job:start", jobModel);

        },

        showDomains: function(model) {
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

            me.filteredDomainCollection = FilteredPaginatedCollection({
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

            //make landers view and display data
            var domainsListView = new ListView({
              collection: me.filteredDomainCollection
            });

            domainsListView.on("childview:showAwsTutorial", function() {
              Landerds.trigger("help:showAwsTutorial");
            });

            domainsListLayout.on("domains:filterList", function(filterVal) {
              me.filteredDomainCollection.filter(filterVal);
            });

            domainsListLayout.on("domains:sort", function() {
              domainsListView.trigger("domains:sort");
            });

            domainsListLayout.on("domains:changepagesize", function(pageSize) {
              me.filteredDomainCollection.setPageSize(pageSize);
            });

            domainsListLayout.on("toggleInfo", function(toggle) {
              if (toggle) {
                //show empty view
                me.filteredDomainCollection.showEmpty(true);
              } else {
                //show landersListView
                me.filteredDomainCollection.showEmpty(false);
              }
            });

            if (domainsListLayout.isRendered) {
              domainsListLayout.landersCollectionRegion.show(domainsListView);
            }

            //this is the pagination pages totals and lander count totals view
            var topbarView = new TopbarView({
              model: me.filteredDomainCollection.state.gui
            });

            me.filteredDomainCollection.on("reset", function(collection) {

              //on reset we're always going to want to close the sidebar
              //this is important so we dont get weird states
              Landerds.trigger('domains:closesidebar');
              Landerds.trigger('landers:closesidebar');
              Landerds.trigger('campaigns:closesidebar');

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
                    Landerds.trigger("domains:updateTopbarTotals");

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
                      Landerds.trigger('domains:closesidebar');

                    }
                  });

                  domainView.lander_tab_handle_region.show(landerTabHandleView);
                  domainView.campaign_tab_handle_region.show(campaignTabHandleView);
                  domainView.deployed_landers_region.show(deployedLandersView);
                  domainView.active_campaigns_region.show(activeCampaignsView);
                });
              }

              //set topbar totals on reset
              Landerds.trigger("domains:updateTopbarTotals")
            });


            var paginatedButtonView = new PaginatedButtonView({
              model: me.filteredDomainCollection.state.gui
            });
            paginatedButtonView.on("firstPage", function(page) {
              me.filteredDomainCollection.getFirstPage();
            });
            paginatedButtonView.on("previousPage", function(page) {
              me.filteredDomainCollection.getPreviousPage();
            });
            paginatedButtonView.on("nextPage", function(page) {
              me.filteredDomainCollection.getNextPage();
            });
            paginatedButtonView.on("lastPage", function(page) {
              me.filteredDomainCollection.getLastPage();
            });
            paginatedButtonView.on("gotoPage", function(page) {
              me.filteredDomainCollection.gotoPage(page);
            });


            if (domainsListLayout.isRendered) {
              domainsListLayout.footerRegion.show(paginatedButtonView);
              domainsListLayout.topbarRegion.show(topbarView);
            }

            var filterVal = $(".lander-search").val() || "";
            if (me.filteredDomainCollection.length > 0) {
              me.filteredDomainCollection.filter(filterVal);
            }
          });
        },

        //add the lander model to the list
        addDomain: function(domainModel) {
          Landerds.trigger('domains:closesidebar');
          this.filteredDomainCollection.add(domainModel);
          //1. goto page with new lander on it
          this.filteredDomainCollection.showPageWithModel(domainModel);
          //2. expand new lander
          domainModel.trigger("view:expand");
        },

        //remove the domain from the landers list by starting a delete job!
        deleteDomain: function(model) {
          var domain_id = model.get("id");
          var domainModel = this.filteredDomainCollection.get(domain_id);

          var jobAttributes = {
            action: "deleteDomain",
            domain_id: domainModel.get("id"),
            deploy_status: "deleting"
          }
          var jobModel = new JobModel(jobAttributes);

          var activeJobCollection = domainModel.get("activeJobs");
          activeJobCollection.add(jobModel);
          Landerds.trigger("job:start", jobModel);

        },

        updateTopbarTotals: function() {
          if (this.filteredDomainCollection) {
            this.filteredDomainCollection.updateTotals();
          }
        }
      }
    });

    return Landerds.DomainsApp.Domains.List.Controller;
  });
