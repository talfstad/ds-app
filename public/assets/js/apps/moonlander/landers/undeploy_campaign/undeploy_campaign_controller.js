define(["app",
    "assets/js/apps/moonlander/landers/undeploy_campaign/views/undeploy_campaign_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Moonlander, UndeployLayoutView, JobModel) {
    Moonlander.module("LandersApp.Landers.List.Campaign.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromCampaignDialog: function(attr) {
          var activeCampaignModel = attr.campaign_model;
          var landerModel = attr.lander_model;
          var campaign_id = activeCampaignModel.get("campaign_id");

          var removeDomainFromCampaignLayout = new UndeployLayoutView({
            campaign_model: activeCampaignModel,
            lander_model: landerModel
          });

          removeDomainFromCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          //on add save the camp to db
          removeDomainFromCampaignLayout.on("removeCampaignFromDomain", function() {

            var activeCampaignModelActiveJobs = activeCampaignModel.get("activeJobs");

            var deployedDomainCollection = landerModel.get("deployedDomains");

            $.each(activeCampaignModel.get("deployedDomains"), function(idx, deployedDomainAttr) {

              deployedDomainCollection.each(function(deployedDomainModel) {
                var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");

                //find the deployed landers that belong to this campaign
                campaignDomainId = deployedDomainAttr.domain_id || deployedDomainAttr.id;
                deployedDomainModelId = deployedDomainModel.get("domain_id") || deployedDomainModel.get("id")
                if (campaignDomainId == deployedDomainModelId) {

                  //create undeploy job for domain and add it to the domain and the lander model
                  var jobAttributes = {
                    action: "undeployLanderFromDomain",
                    lander_id: landerModel.get("lander_id") || landerModel.get("id"),
                    domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
                    campaign_id: campaign_id,
                    deploy_status: "undeploying"
                  };

                  var jobModel = new JobModel(jobAttributes);

                  deployedDomainModelActiveJobs.add(jobModel);
                  activeCampaignModelActiveJobs.add(jobModel);

                  Moonlander.trigger("job:start", jobModel);

                }

              });

            });


            //no landers on campaign so nothing needs to be undeployed. just destroy it
            if (activeCampaignModel.get("deployedDomains").length <= 0) {
              activeCampaignModel.destroy();
            }
          });
        }

      }
    });

    return Moonlander.LandersApp.Landers.List.Campaign.Undeploy.Controller;
  });
