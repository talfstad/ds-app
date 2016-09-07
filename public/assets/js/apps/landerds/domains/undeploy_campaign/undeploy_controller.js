define(["app",
    "assets/js/apps/landerds/domains/undeploy_campaign/views/undeploy_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("DomainsApp.Domains.List.Campaign.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromCampaignDialog: function(attr) {
          var activeCampaignModel = attr.campaign_model;
          var domainModel = attr.domain_model;
          var campaign_id = activeCampaignModel.get("campaign_id");

          var removeDomainFromCampaignLayout = new UndeployLayoutView({
            campaign_model: activeCampaignModel,
            domain_model: domainModel
          });

          removeDomainFromCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          removeDomainFromCampaignLayout.on("removeCampaignFromDomain", function() {
            //no landers on campaign so nothing needs to be undeployed. just destroy it
            activeCampaignModel.destroy();
          });
        }

      }
    });

    return Landerds.DomainsApp.Domains.List.Campaign.Undeploy.Controller;
  });
