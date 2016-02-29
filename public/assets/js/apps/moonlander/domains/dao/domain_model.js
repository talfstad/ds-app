define(["app",
    "/assets/js/apps/moonlander/domains/dao/deployed_lander_collection.js",
    "/assets/js/apps/moonlander/domains/dao/active_campaign_collection.js",
    "/assets/js/jobs/jobs_base_gui_model.js"
  ],
  function(Moonlander, DeployedLanderCollection, ActiveCampaignCollection, JobsGuiBaseModel) {
    var DomainModel = JobsGuiBaseModel.extend({
      urlRoot: "/api/domains",

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
              if (jobModel.get("action") === "deleteDomain") {
                //adding we're deleting so lets set that deploy_status
                me.set("deploy_status", "deleting");
              }
            });
          }
        });

        activeJobsCollection.on("finishedState", function(jobModel) {
          var deployStatus = "deployed";
          if (jobModel.get("action") === "deleteDomain") {
            me.trigger("notifySuccessDeleteDomain");
            //destroy the domain model
            delete me.attributes.id;
            me.destroy();
          }

          //hack to not delete job from server
          delete jobModel.attributes.id;
          jobModel.destroy();

          //trigger to start the next job on the list
          Moonlander.trigger("job:startNext", activeJobsCollection);

        });

        activeJobsCollection.on("errorState", function(jobModel) {
          //change deploy status back to deployed
          me.set("deploy_status", "deployed");
        
          me.trigger("notifyErrorDeleteDomain", jobModel.get("error"));

          //hack to not delete job from server
          delete jobModel.attributes.id;
          jobModel.destroy();

        });

        this.startActiveJobs();
        ////////////////////////////end job init///////////////////////

        //1. build deployedLanders collection - TODO
        var activeCampaignAttributes = this.get("activeCampaigns");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLandersCollection = new DeployedLanderCollection(deployedLandersAttributes);

        this.set("deployedLanders", deployedLandersCollection);

        var activeCampaignsCollection = new ActiveCampaignCollection();

        var applyUpdatedDeployStatusToLander = function() {
          //update deploy status view UNLESS we're initializing or deleting. if initializing needs to be changed
          //to not_deployed by the lander job itself because we're adding a new lander. this logic is
          // for when the lander is already added
          if (me.get("deploy_status") !== "initializing" &&
            me.get("deploy_status") !== "deleting") {
            var deployStatus = "deployed";
            deployedLandersCollection.each(function(deployedLanderModel) {
              if (deployedLanderModel.get("activeJobs").length > 0) {
                deployStatus = "deploying";
              } else if(deployedLanderModel.get("deploy_status") === "modified") {
                deployStatus = "modified";
              }
            });

            //catch if there are no models, set to not_deployed
            if (deployedLandersCollection.length <= 0) {
              deployStatus = "not_deployed"
            }

            me.set("deploy_status", deployStatus);
          }
        }

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedLandersCollection.on("add change:deploy_status", function(domainModel) {
          applyUpdatedDeployStatusToLander();
        });

        activeCampaignsCollection.on("add", function(campaignModel, campaignCollection, options) {
          // check all deployed locations make sure all campaign model deployed domains is deployed if not then trigger
          // a deploy here
          // $.each(campaignModel.get("currentDomains"), function(idx, currentDomain) {

          //   var isDeployed = false;
          //   var isUndeploying = false;
          //   var isDeploying = false;
          //   deployedLandersCollection.each(function(deployLanderModel) {
          //     //is this lander deployed to this domain?

          //     if (currentDomain.domain_id == deployLanderModel.id) {
          //       isDeployed = true;

          //       deployLanderModel.get("activeJobs").each(function(job) {
          //         if (job.get("action") == "undeployLanderFromDomain") {
          //           isUndeploying = true;
          //         } else if (job.get("action") == "deployLanderToDomain") {
          //           isDeploying = true;
          //         }
          //       });

          //       //add this campaign info to the deployed location so we can see that it belongs to
          //       //this campaign in the deployed tab
          //       var attachedCampaigns = deployLanderModel.get("attachedCampaigns");
          //       attachedCampaigns.add(campaignModel);
          //     }
          //   });

          //   //if currentDomain is deployed do nothing, if not trigger a deploy on it
          //   if (!isDeployed || isUndeploying || isDeploying) {
          //     //trigger deploy
          //     var attr = {
          //       lander_id: me.get("id"),
          //       id: currentDomain.domain_id,
          //       lander_model: me,
          //       domain: currentDomain.domain
          //     }
          //     Moonlander.trigger("domains:deployLanderToNewDomain", attr);
          //   }
          // });
        }, this);

        this.set("activeCampaigns", activeCampaignsCollection);
        activeCampaignsCollection.add(activeCampaignAttributes);
      },

      defaults: {
        name: "",
        created_on: "",
        deployedLanders: [],
        activeCampaigns: [],
        deploy_status: "deployed",
        active_campaigns_count: 0,
        active_landers_count: 0
      }

    });
    return DomainModel;
  });
