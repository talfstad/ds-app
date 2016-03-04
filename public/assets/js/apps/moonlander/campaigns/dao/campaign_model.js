define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_lander_collection.js",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_domain_collection.js"
  ],
  function(Moonlander, DeployedLanderCollection, DeployedDomainCollection) {
    var CampaignModel = Backbone.Model.extend({
      urlRoot: '/api/campaigns',

      initialize: function() {
        var me = this;


        //1. build deployedLanders collection - TODO
        var deployedDomainAttributes = this.get("deployedDomains");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLandersCollection = new DeployedLanderCollection(deployedLandersAttributes);

        this.set("deployedLanders", deployedLandersCollection);

        var deployedDomainCollection = new DeployedDomainCollection();

        var applyUpdatedDeployStatusToCampaign = function() {
          //update deploy status view UNLESS we're initializing or deleting. if initializing needs to be changed
          //to not_deployed by the lander job itself because we're adding a new lander. this logic is
          // for when the lander is already added
          if (me.get("deploy_status") !== "initializing" &&
            me.get("deploy_status") !== "deleting") {
            var deployStatus = "deployed";
            deployedLandersCollection.each(function(deployedLanderModel) {
              if (deployedLanderModel.get("activeJobs").length > 0) {
                deployStatus = "deploying";
              } else if (deployedLanderModel.get("deploy_status") === "modified") {
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
          applyUpdatedDeployStatusToCampaign();
        });

        deployedDomainCollection.on("add", function(campaignModel, campaignCollection, options) {
          // check all deployed locations make sure all campaign model deployed domains is deployed if not then trigger
          // a deploy here
          // $.each(campaignModel.get("currentLanders"), function(idx, currentLanderAttributes) {

          //   var isDeployed = false;
          //   var isUndeploying = false;
          //   var isDeploying = false;
          //   deployedLandersCollection.each(function(deployLanderModel) {
          //     //is this lander deployed to this domain?
          //     var currentLanderId = currentLanderAttributes.id || currentLanderAttributes.lander_id;
          //     var deployLocationId = deployLanderModel.get("lander_id") || deployLanderModel.get("id");
          //     if (currentLanderId == deployLocationId) {
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

          //   //if currentLander is deployed do nothing, if not trigger a deploy on it.. why did i say this
          //   if (!isDeployed || isUndeploying) {
          //     //deploying from a campaign so we need to add the attached campaign to it
          //     // currentLanderAttributes.attachedCampaigns = [];
          //     // currentLanderAttributes.attachedCampaigns.push(campaignModel.attributes);
          //     //trigger deploy
          //     var attr = {
          //       landerAttributes: currentLanderAttributes,
          //       domain_id: me.get("id"),
          //       domain_model: me,
          //       campaign_id: campaignModel.get("campaign_id") || campaignModel.get("id")
          //     };
          //     Moonlander.trigger("domains:deployNewLander", attr);
          //   }
          // });
        }, this);

        this.set("deployedDomains", deployedDomainCollection);
        deployedDomainCollection.add(deployedDomainAttributes);


        applyUpdatedDeployStatusToCampaign();
      },

      defaults: {
        name: "",
        created_on: "",
        deployedLanders: [],
        deployedDomains: [],
        deploy_status: "deployed",
        deployed_domains_count: 0,
        deployed_landers_count: 0
      }


    });

    return CampaignModel;

  });
