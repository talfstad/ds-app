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

            if (deployStatus !== "deployed") {
              deployedDomainCollection.each(function(deployedDomainModel) {
                if (deployedDomainModel.get("activeJobs").length > 0) {
                  deployStatus = "deploying";
                }
              });
            }

            me.set("deploy_status", deployStatus);
          }
        }

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedLandersCollection.on("add change:deploy_status", function() {
          applyUpdatedDeployStatusToCampaign();
        });

        deployedDomainCollection.on("add change:deploy_status", function() {
          applyUpdatedDeployStatusToCampaign();
        });

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
