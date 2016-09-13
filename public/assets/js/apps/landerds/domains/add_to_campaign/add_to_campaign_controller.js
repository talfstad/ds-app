define(["app",
    "assets/js/apps/landerds/domains/add_to_campaign/views/loading_view",
    "assets/js/apps/landerds/domains/add_to_campaign/views/campaigns_list_view",
    "assets/js/apps/landerds/domains/dao/active_campaign_model",
    "assets/js/apps/landerds/domains/add_to_campaign/views/add_to_campaign_layout_view",
    "assets/js/apps/landerds/campaigns/dao/campaign_collection"
  ],
  function(Landerds, LoadingView, CampaignsListView, ActiveCampaignModel, AddToCampaignLayoutView) {
    Landerds.module("DomainsApp.Domains.AddToCampaign", function(AddToCampaign, Landerds, Backbone, Marionette, $, _) {

      AddToCampaign.Controller = {

        showAddNewCampaign: function(domainModel) {

          var addCampaignToDomainLayout = new AddToCampaignLayoutView({
            model: domainModel
          });

          addCampaignToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addCampaignToDomainLayout);

          addCampaignToDomainLayout.on("addCampaignToDomain", function(campaignModel) {

            //create an add the active campaign model to the lander
            var domain_id = domainModel.get("id");
            var deployedLanderCollection = campaignModel.get("deployedLanders");

            //add this domain as a new domain for this campaign model
            var domains = campaignModel.get("domains");
            domains.push({
              domain_id: domain_id,
              domain: domainModel.get("domain")
            });

            var newActiveCampaignModel = new ActiveCampaignModel({
              deployedLanders: deployedLanderCollection,
              campaign_id: campaignModel.get("id"),
              name: campaignModel.get("name"),
              domain_id: domain_id,
              action: "domain",
              domains: domains,
              landers: deployedLanderCollection.toJSON(), //prob eventually needs to be correct landers arr

            });

            var activeCampaignCollection = domainModel.get("activeCampaigns");
            activeCampaignCollection.add(newActiveCampaignModel);

            var listToDeploy = [];

            if (deployedLanderCollection.length > 0) {

              deployedLanderCollection.each(function(deployedLander) {
                listToDeploy.push({
                  name: deployedLander.get("name"),
                  domain_id: domain_id,
                  campaign_id: campaignModel.get("id"),
                  modified: deployedLander.get("modified"),
                  lander_id: deployedLander.get("lander_id"),
                  deployedDomains: deployedLander.get("deployedDomains"),
                  urlEndpoints: deployedLander.get("urlEndpoints"),
                  deployment_folder_name: deployedLander.get("deployment_folder_name"),
                  endpoint_load_times: deployedLander.get("endpoint_load_times")
                });
              });

            } else {
              //push on a dummy object with key to say "dont try to add any domains before calling redeploy"
              listToDeploy.push({
                domain_id: domain_id,
                noLandersToAdd: true
              });
            }

            Landerds.trigger("domains:deployLandersToDomain", {
              model: domainModel,
              listToDeploy: listToDeploy
            });
          });

          //show loading
          var loadingView = new LoadingView();
          addCampaignToDomainLayout.campaignsListRegion.show(loadingView)


          var deferredCampaignsCollection = Landerds.request("campaigns:campaignsCollection");

          $.when(deferredCampaignsCollection).done(function(campaignsCollection) {

            //filter this collection, take out campaigns that lander is already deployed to
            var filteredCampaignsCollection = campaignsCollection.filterOutCampaigns(domainModel.get("activeCampaigns"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var campaignsListView = new CampaignsListView({
              datatablesCollection: filteredCampaignsCollection
            });


            //show actual view
            addCampaignToDomainLayout.campaignsListRegion.show(campaignsListView)

          });
        }
      }
    });

    return Landerds.DomainsApp.Domains.AddToCampaign.Controller;
  });
