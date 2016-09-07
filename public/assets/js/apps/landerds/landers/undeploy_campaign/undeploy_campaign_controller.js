define(["app",
    "assets/js/apps/landerds/landers/undeploy_campaign/views/undeploy_campaign_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("LandersApp.Landers.List.Campaign.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

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

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          removeDomainFromCampaignLayout.on("removeCampaignFromLander", function() {
            //no landers on campaign so nothing needs to be undeployed. just destroy it
            activeCampaignModel.destroy();
          });
        }

      }
    });

    return Landerds.LandersApp.Landers.List.Campaign.Undeploy.Controller;
  });
