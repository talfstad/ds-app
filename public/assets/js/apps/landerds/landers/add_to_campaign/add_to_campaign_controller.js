define(["app",
    "assets/js/apps/landerds/landers/add_to_campaign/views/loading_view",
    "assets/js/apps/landerds/landers/add_to_campaign/views/campaigns_list_view",
    "assets/js/apps/landerds/landers/dao/active_campaign_model",
    "assets/js/apps/landerds/landers/add_to_campaign/views/add_to_campaign_layout_view",
    "assets/js/apps/landerds/campaigns/dao/campaign_collection"
  ],
  function(Landerds, LoadingView, CampaignsListView, ActiveCampaignModel, AddToCampaignLayoutView) {
    Landerds.module("LandersApp.Landers.AddToCampaign", function(AddToCampaign, Landerds, Backbone, Marionette, $, _) {

      AddToCampaign.Controller = {

        showAddNewCampaign: function(landerModel) {

          var addCampaignToLanderLayout = new AddToCampaignLayoutView({
            model: landerModel
          });

          addCampaignToLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addCampaignToLanderLayout);

          addCampaignToLanderLayout.on("addCampaignToLander", function(campaignModel) {

            //create an add the active campaign model to the lander
            var lander_id = landerModel.get("id");
            var domains = campaignModel.get("domains");

            var newActiveCampaignModel = new ActiveCampaignModel({
              domains: domains,
              campaign_id: campaignModel.get("id"),
              name: campaignModel.get("name"),
              lander_id: lander_id,
              action: "lander"
            });

            var activeCampaignCollection = landerModel.get("activeCampaigns");
            activeCampaignCollection.add(newActiveCampaignModel);

            var domainListToDeploy = [];

            if (domains.length > 0) {

              $.each(domains, function(idx, domain) {
                domainListToDeploy.push({
                  domain: domain.domain,
                  domain_id: domain.domain_id,
                  lander_id: lander_id
                });
              });
            } else {
              //push on a dummy object with key to say "dont try to add any domains before calling redeploy"
              domainListToDeploy.push({
                lander_id: lander_id,
                noDomainsToAdd: true
              });
            }

            Landerds.trigger("landers:deployLandersToDomain", {
              landerModel: landerModel,
              domainListToDeploy: domainListToDeploy
            });

          });

          //show loading
          var loadingView = new LoadingView();
          addCampaignToLanderLayout.campaignsListRegion.show(loadingView)


          var deferredCampaignsCollection = Landerds.request("campaigns:campaignsCollection");

          $.when(deferredCampaignsCollection).done(function(campaignsCollection) {

            //filter this collection, take out campaigns that lander is already deployed to
            var filteredCampaignsCollection = campaignsCollection.filterOutCampaigns(landerModel.get("activeCampaigns"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var campaignsListView = new CampaignsListView({
              datatablesCollection: filteredCampaignsCollection
            });


            //show actual view
            addCampaignToLanderLayout.campaignsListRegion.show(campaignsListView)

          });
        }
      }
    });

    return Landerds.LandersApp.Landers.AddToCampaign.Controller;
  });
