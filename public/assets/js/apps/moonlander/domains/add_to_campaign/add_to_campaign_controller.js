define(["app",
    "/assets/js/apps/moonlander/domains/add_to_campaign/views/loading_view.js",
    "/assets/js/apps/moonlander/domains/add_to_campaign/views/campaigns_list_view.js",
    "/assets/js/apps/moonlander/domains/add_to_campaign/views/add_to_campaign_layout_view.js",
    "/assets/js/apps/moonlander/domains/dao/campaign_collection.js"
  ],
  function(Moonlander, LoadingView, CampaignsListView, AddToCampaignLayoutView) {
    Moonlander.module("DomainsApp.Domains.AddToCampaign", function(AddToCampaign, Moonlander, Backbone, Marionette, $, _) {

      AddToCampaign.Controller = {

        showAddNewCampaign: function(model) {

          var addLanderToCampaignLayout = new AddToCampaignLayoutView({
            model: model
          });


          addLanderToCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addLanderToCampaignLayout);
          
          //show loading
          var loadingView = new LoadingView();
          addLanderToCampaignLayout.campaignsListRegion.show(loadingView)
        
         
          var deferredCampaignsCollection = Moonlander.request("domains:campaignsCollection");

          $.when(deferredCampaignsCollection).done(function(campaignsCollection) {

            //filter this collection, take out campaigns that lander is already deployed to
            var filteredCampaignsCollection = campaignsCollection.filterOutCampaigns(model.get("activeCampaigns"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var campaignsListView = new CampaignsListView({
              datatablesCollection: filteredCampaignsCollection
            });


            //show actual view
            addLanderToCampaignLayout.campaignsListRegion.show(campaignsListView)

          });




          addLanderToCampaignLayout.on("addLanderToCampaign", function(campaignId, campaign) {
            


            
          });

        }

      }
    });

    return Moonlander.DomainsApp.Domains.AddToCampaign.Controller;
  });
