define(["app",
    "/assets/js/jobs/jobs_base_gui_model.js",
    "/assets/js/apps/moonlander/domains/dao/domain_collection.js",
    "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_collection.js"
  ],
  function(Moonlander, JobsGuiBaseModel, DomainCollection, UrlEndpointCollection,
    DeployedLocationCollection, DeployedLocationsCollection, ActiveCampaignCollection) {
    var LanderModel = JobsGuiBaseModel.extend({
      urlRoot: "/api/landers",


      //init has 3 steps.
      //1. initialize the activeJobs collection in parent class
      //2. now do stuff for this specific type
      //3. start the jobs from the parent class
      initialize: function() {
        JobsGuiBaseModel.prototype.initialize.apply(this);

        var me = this;

        //on active jobs initialize check if any of them exist and handle start state
        var activeJobsCollection = this.get("activeJobs");

        activeJobsCollection.on("startState", function() {
          if (activeJobsCollection.length > 0) {
            activeJobsCollection.each(function(jobModel) {
              if (jobModel.get("action") === "addNewLander") {
                //adding new lander so we're still initializing...
                me.set("deploy_status", "initializing");

              }
              else if(jobModel.get("action") === "ripNewLander"){
                me.set("deploy_status", "initializing");
              } 
              else if (jobModel.get("action") === "deleteLander") {
                me.set("deploy_status", "deleting");
              }
            })
          }
        });


        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "addNewLander" ||
              jobModel.get("action") === "ripNewLander") {

            //update lander status to not deployed
            me.set("deploy_status", "not_deployed");

          } else if (jobModel.get("action") === "deleteLander") {

            //destroy the lander model
            me.destroy();
            Moonlander.trigger("landers:updateTopbarTotals");
          }

        });

        this.startActiveJobs();



        ////////

        //1. build deployedLocations collection
        //2. build urlendpoint collection
        var activeCampaignAttributes = this.get("activeCampaigns");
        var urlEndpointAttributes = this.get("urlEndpoints");
        var deployedLocationsAttributes = this.get("deployedLocations");

        var deployedLocationsCollection = new DeployedLocationsCollection(deployedLocationsAttributes);
        //extra things it needs
        deployedLocationsCollection.urlEndpoints = urlEndpointAttributes;
        deployedLocationsCollection.landerName = this.get("name");

        this.set("deployedLocations", deployedLocationsCollection);

        var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
        this.set("urlEndpoints", urlEndpointCollection);

        var activeCampaignsCollection = new ActiveCampaignCollection();

        // when adding models to the active campaign collection, make sure that each
        // campaigns current domains is in deployedLocations. if not then trigger a deploy on
        // 
        var deployedDomainsCollection = this.get("deployedLocations");

        activeCampaignsCollection.on("add", function(campaignModel, campaignCollection, options) {
          // check all deployed locations make sure all campaign model deployed domains is deployed if not then trigger
          // a deploy here
          $.each(campaignModel.get("currentDomains"), function(idx, currentDomain) {

            var isDeployed = false;

            deployedDomainsCollection.each(function(deployLocationModel) {

              if (currentDomain.domain_id == deployLocationModel.id) {
                isDeployed = true;

                //add this campaign info to the deployed location so we can see that it belongs to
                //this campaign in the deployed tab
                var attachedCampaigns = deployLocationModel.get("attachedCampaigns");
                attachedCampaigns.add(campaignModel);
              }
            });

            //if currentDomain is deployed do nothing, if not trigger a deploy on it
            if (!isDeployed) {
              //trigger deploy
              var attr = {
                lander_id: me.get("id"),
                id: currentDomain.domain_id,
                lander_model: me,
                domain: currentDomain.domain
              }
              Moonlander.trigger("landers:deployLanderToNewDomain", attr);
            }
          });
        }, this);

        this.set("activeCampaigns", activeCampaignsCollection);



        activeCampaignsCollection.add(activeCampaignAttributes);


        //when lander changes its deploy status update the topbar totals
        this.on("change:deploy_status", function() {
          var deployStatus = this.get("deploy_status");
          deployedDomainsCollection.deploy_status = deployStatus;
          activeCampaignsCollection.deploy_status = deployStatus;
        });

        var applyUpdatedDeployStatusToLander = function() {
          //update deploy status view UNLESS we're initializing or deleting. if initializing needs to be changed
          //to not_deployed by the lander job itself because we're adding a new lander. this logic is
          // for when the lander is already added
          if (me.get("deploy_status") !== "initializing" &&
            me.get("deploy_status") !== "deleting") {
            var deployStatus = "deployed";
            deployedDomainsCollection.each(function(deployedDomainModel) {
              if (deployedDomainModel.get("activeJobs").length > 0) {
                deployStatus = "deploying";
              }
            });

            //catch if there are no models, set to not_deployed
            if(deployedDomainsCollection.length <= 0){
              deployStatus = "not_deployed"
            }

            me.set("deploy_status", deployStatus);
          }
        }

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedDomainsCollection.on("change:deploy_status", function(domainModel) {
          applyUpdatedDeployStatusToLander();
        });

        deployedDomainsCollection.on("destroy", function(domainModel) {
          applyUpdatedDeployStatusToLander();
        });


        //set deploy_status based on our new model

        //deployedLocation Jobs
        var deployStatus = "not_deployed";
        if (deployedDomainsCollection.length > 0) {
          deployStatus = "deployed";
          deployedDomainsCollection.each(function(location) {

            location.get("activeJobs").each(function(job) {
              if (job.get("action") === "undeployLanderFromDomain") {
                deployStatus = "undeploying";
              } else if (job.get("action") === "deployLanderToDomain") {
                deployStatus = "deploying";
              }
            });

          });
        }

        //lander level jobs override deployedLocation jobs
        if (activeJobsCollection.length > 0) {
          activeJobsCollection.each(function(job) {
            if (job.get("action") === "deletingLander") {
              deployStatus = "deleting";
            } 
            else if (job.get("action") === "addNewLander") {
              deployStatus = "initializing";
            }
            else if (job.get("action") === "ripNewLander") {
              deployStatus = "initializing";
            }
          });
        }
        this.set("deploy_status", deployStatus);


      },

      defaults: {
        name: "",
        last_updated: "",
        urlEndpointsJSON: [],
        optimize_js: false,
        optimize_css: false,
        optimize_images: false,
        optimize_gzip: false,
        urlEndpoints: [],
        deployedLocations: [],
        activeCampaigns: [],
        //gui update attributes
        deploy_status: 'not_deployed',
        active_campaigns_count: 0,
        totalNumJsSnippets: 0
      }

    });
    return LanderModel;
  });
