define(["app",
    "assets/js/apps/landerds/campaigns/undeploy_lander/views/undeploy_lander_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromCampaignLayout, JobModel) {
    Landerds.module("CampaignsApp.Campaigns.RemoveLander", function(RemoveLander, Landerds, Backbone, Marionette, $, _) {

      RemoveLander.Controller = {

        showUndeployLander: function(attr) {
          var campaignModel = attr.campaign_model;
          var deployedLanderModel = attr.lander_model;
          var campaign_id = campaignModel.get("id");

          var removeLanderFromCampaignLayout = new RemoveLanderFromCampaignLayout({
            campaign_model: campaignModel,
            lander_model: deployedLanderModel
          });

          removeLanderFromCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeLanderFromCampaignLayout);

          //on add save the camp to db
          removeLanderFromCampaignLayout.on("removeLanderFromCampaignConfirm", function() {
            //just destroy it to unattach it
            deployedLanderModel.destroy();
          });
        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.RemoveLander.Controller;
  });
