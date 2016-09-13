define(["app",
    "assets/js/apps/landerds/campaigns/undeploy_domain/views/undeploy_domain_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveDomainFromCampaignLayout, JobModel) {
    Landerds.module("CampaignsApp.Campaigns.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Controller = {

        showUndeployDomain: function(attr) {
          var campaignModel = attr.campaign_model;
          var domainListModel = attr.domain_model;
          var campaign_id = campaignModel.get("id");

          var removeDomainFromCampaignLayout = new RemoveDomainFromCampaignLayout({
            campaign_model: campaignModel,
            domain_model: domainListModel
          });

          removeDomainFromCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromCampaignLayout);

          //on add save the camp to db
          removeDomainFromCampaignLayout.on("removeDomainFromCampaignConfirm", function() {

            //just destroy it to unattach it
            domainListModel.destroy();

          });


        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.RemoveDomain.Controller;
  });
