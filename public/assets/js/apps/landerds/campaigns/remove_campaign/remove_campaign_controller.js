define(["app",
    "assets/js/apps/landerds/campaigns/remove_campaign/views/remove_campaign_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromCampaignLayout, JobModel) {
    Landerds.module("CampaignsApp.Campaigns.RemoveCampaign", function(RemoveCampaign, Landerds, Backbone, Marionette, $, _) {

      RemoveCampaign.Controller = {

        showRemoveCampaign: function(campaignModel) {
          var campaign_id = campaignModel.get("id");

          var removeCampaignLayout = new RemoveLanderFromCampaignLayout({
            model: campaignModel
          });

          removeCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeCampaignLayout);

          removeCampaignLayout.on("removeCampaignConfirm", function() {

            //1. create a deleteCampaign job add to active jobs for campaign

            var jobAttributes = {
              action: "deleteCampaign",
              campaign_id: campaign_id,
              deploy_status: "deleting"
            };

            var jobModel = new JobModel(jobAttributes);

            var activeJobs = campaignModel.get("activeJobs");
            activeJobs.add(jobModel);

            Landerds.trigger("job:start", jobModel);

            

          });

        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.RemoveCampaign.Controller;
  });
