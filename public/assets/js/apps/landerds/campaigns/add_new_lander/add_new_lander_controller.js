define(["app",
    "assets/js/apps/landerds/campaigns/add_new_lander/views/loading_view",
    "assets/js/apps/landerds/campaigns/add_new_lander/views/landers_list_view",
    "assets/js/apps/landerds/campaigns/add_new_lander/views/add_new_lander_layout_view",
    "assets/js/apps/landerds/campaigns/dao/deployed_lander_model",
    "assets/js/apps/landerds/campaigns/dao/lander_collection"
  ],
  function(Landerds, LoadingView, LandersListView, AddLanderToCampaignLayout, DeployedLanderModel) {
    Landerds.module("CampaignsApp.Campaigns.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLander: function(campaignModel) {

          var campaign_id = campaignModel.get("id");

          var addLanderToCampaignLayout = new AddLanderToCampaignLayout({
            model: campaignModel
          });

          addLanderToCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addLanderToCampaignLayout);

          //on add save the camp to db
          addLanderToCampaignLayout.on("addLanderToCampaign", function(landerAttributes) {

            //taking a lander model and making it a deployed lander model
            landerAttributes.lander_id = landerAttributes.id;
            landerAttributes.campaign_id = campaign_id;

            //callback
            var addedLanderToCampaignSuccessCallback = function(deployedLanderModel) {

              //save this lander to landers_with_campaigns
              var deployLanderToCampaignDomainsAttrs = {
                deployed_lander_model: deployedLanderModel,
                campaign_model: campaignModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("campaigns:deployLanderToCampaignDomains", deployLanderToCampaignDomainsAttrs);

            };
            var addedLanderToCampaignErrorCallback = function(err, two, three) {

            };

            //add the campaign to the domain first, on success close dialog
            var deployedLanderModel = new DeployedLanderModel(landerAttributes);
            deployedLanderModel.unset("id");
            
            // create the model for activeCampaign model. make sure it saves to
            // /api/active_campaigns
            deployedLanderModel.save({}, {
              success: addedLanderToCampaignSuccessCallback,
              error: addedLanderToCampaignErrorCallback
            });

          });


          //show loading
          var loadingView = new LoadingView();
          addLanderToCampaignLayout.landersListRegion.show(loadingView);

          var deferredLandersCollection = Landerds.request("campaigns:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            //filter this collection, take out landers that campaign is already deployed to
            var filteredLandersCollection = landersCollection.filterOutLanders(campaignModel.get("deployedLanders"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var landersListView = new LandersListView({
              datatablesCollection: filteredLandersCollection
            });

            //show actual view
            addLanderToCampaignLayout.landersListRegion.show(landersListView);

          });

        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.AddNewLander.Controller;
  });
