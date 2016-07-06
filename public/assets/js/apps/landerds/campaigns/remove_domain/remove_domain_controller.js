define(["app",
    "assets/js/apps/landerds/campaigns/remove_domain/views/remove_domain_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveDomainFromCampaignLayout, JobModel) {
    Landerds.module("CampaignsApp.Campaigns.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Controller = {

        showRemoveDomain: function(attr) {
          var campaignModel = attr.campaign_model;
          var deployedDomainModel = attr.domain_model;
          var campaign_id = campaignModel.get("id");

          var removeDomainFromCampaignLayout = new RemoveDomainFromCampaignLayout({
            campaign_model: campaignModel,
            domain_model: deployedDomainModel
          });

          removeDomainFromCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          //on add save the camp to db
          removeDomainFromCampaignLayout.on("removeDomainFromCampaignConfirm", function() {

            var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");

            var deployedLandersCollection = campaignModel.get("deployedLanders");
            deployedLandersCollection.each(function(deployedLanderModel) {

              var deployedLanderModelActiveJobs = deployedLanderModel.get("activeJobs");

              //create undeploy job for domain and add it to the domain and the lander model
              var jobAttributes = {
                action: "undeployDomainFromLander",
                lander_id: deployedLanderModel.get("lander_id") || deployedLanderModel.get("id"),
                domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
                campaign_id: campaign_id,
                deploy_status: "undeploying"
              };

              var jobModel = new JobModel(jobAttributes);

              deployedLanderModelActiveJobs.add(jobModel);
              deployedDomainModelActiveJobs.add(jobModel);

              Landerds.trigger("job:start", jobModel);

            });
            //no domains so nothing needs to be undeployed. just destroy it
            if (deployedLandersCollection.length <= 0) {
              deployedDomainModel.destroy();
            }



          });


        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.RemoveDomain.Controller;
  });