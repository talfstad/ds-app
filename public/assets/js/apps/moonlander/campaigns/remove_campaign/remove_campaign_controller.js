define(["app",
    "/assets/js/apps/moonlander/campaigns/remove_campaign/views/remove_campaign_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, RemoveLanderFromCampaignLayout, JobModel) {
    Moonlander.module("CampaignsApp.Campaigns.RemoveCampaign", function(RemoveCampaign, Moonlander, Backbone, Marionette, $, _) {

      RemoveCampaign.Controller = {

        showRemoveCampaign: function(campaignModel) {
          var campaign_id = campaignModel.get("id");

          var removeCampaignLayout = new RemoveLanderFromCampaignLayout({
            model: campaignModel
          });

          removeCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(removeCampaignLayout);

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

            Moonlander.trigger("job:start", jobModel);

            

          });

        }

      }
    });

    return Moonlander.CampaignsApp.Campaigns.RemoveCampaign.Controller;
  });
