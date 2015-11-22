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

      initialize: function() {
        var me = this;

        //on active jobs initialize check if any of them exist and handle start state
        this.on("change:activeJobs", function(landerModel, activeJobsCollection) {
          if (activeJobsCollection.length > 0) {
            activeJobsCollection.each(function(jobModel) {
              if (jobModel.get("action") === "addNewLander") {
                //adding new lander so we're still initializing...
                me.set("deploy_status","initializing");
              }
            })
          }
        });

        JobsGuiBaseModel.prototype.initialize.apply(this);

        var activeJobs = this.get("activeJobs");

        activeJobs.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "addNewLander") {
            //1. always destroy the active job model
            jobModel.trigger('destroy');
            //update lander status to not deployed
            me.set("deploy_status", "not_deployed");
          }

        });

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
