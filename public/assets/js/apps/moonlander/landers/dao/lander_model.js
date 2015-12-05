define(["app",
    "/assets/js/jobs/jobs_base_gui_model.js",
    "/assets/js/apps/moonlander/domains/dao/domain_collection.js",
    "/assets/js/apps/moonlander/landers/dao/url_endpoint_collection.js",
    "/assets/js/apps/moonlander/landers/dao/deployed_location_collection.js",
    "/assets/js/apps/moonlander/landers/dao/active_campaign_collection.js"
  ],
  function(Moonlander, JobsGuiBaseModel, DomainCollection, UrlEndpointCollection,
    DeployedLocationCollection, ActiveCampaignCollection) {
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

              } else if (jobModel.get("action") === "deleteLander") {
                me.set("deploy_status", "deleting");              
              }
            })
          }
        });


        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "addNewLander") {

            //update lander status to not deployed
            me.set("deploy_status", "not_deployed");

          } else if (jobModel.get("action") === "deleteLander") {

            //destroy the lander model
            me.destroy();
            Moonlander.trigger("landers:updateTopbarTotals");
          }

        });

        this.startActiveJobs();

      },

      defaults: {
        name: "",
        last_updated: "",
        optimize_js: false,
        optimize_css: false,
        optimize_images: false,
        optimize_gzip: false,
        urlEndpoints: new UrlEndpointCollection,
        deployedLocations: new DeployedLocationCollection,
        activeCampaigns: new ActiveCampaignCollection,
        //gui update attributes
        deploy_status: 'not_deployed',
        active_campaigns_count: 0
      }

    });
    return LanderModel;
  });
