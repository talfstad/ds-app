define(["app",
    "assets/js/apps/landerds/landers/add_to_campaign/views/loading_view",
    "assets/js/apps/landerds/landers/add_to_campaign/views/campaigns_list_view",
    "assets/js/apps/landerds/landers/dao/active_campaign_model",
    "assets/js/apps/landerds/landers/add_to_campaign/views/add_to_campaign_layout_view",
    "assets/js/apps/landerds/landers/dao/campaign_collection"
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

          addCampaignToLanderLayout.on("addCampaignToLander", function(campaignAttributes) {

            //taking a campaign model and making it an active campaign model
            campaignAttributes.campaign_id = campaignAttributes.id;
            campaignAttributes.lander_id = landerModel.get("id");

            //callback
            var addedDomainToCampaignSuccessCallback = function(activeCampaignModel) {

              //save this lander to landers_with_campaigns
              var deployCampaignToDomainAttrs = {
                active_campaign_model: activeCampaignModel,
                lander_model: landerModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("landers:deployCampaignLandersToDomain", deployCampaignToDomainAttrs);

            };
            var addedDomainToCampaignErrorCallback = function(err, two, three) {

            };

            //add the campaign to the domain first, on success close dialog
            var activeCampaignModel = new ActiveCampaignModel(campaignAttributes);
            activeCampaignModel.unset("id");

            // create the model for activeCampaign model. make sure it saves to
            activeCampaignModel.save({}, {
              success: addedDomainToCampaignSuccessCallback,
              error: addedDomainToCampaignErrorCallback
            });
          });

          //show loading
          var loadingView = new LoadingView();
          addCampaignToLanderLayout.campaignsListRegion.show(loadingView)


          var deferredCampaignsCollection = Landerds.request("domains:campaignsCollection");

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
