define(["app",
    "assets/js/apps/moonlander/campaigns/add_new_campaign/views/add_new_campaign_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/moonlander/campaigns/dao/campaign_model"
  ],
  function(Moonlander, AddNewCampaignLayoutView, JobModel, CampaignModel) {
    Moonlander.module("CampaignsApp.Campaigns.AddNewCampaign", function(AddNewCampaign, Moonlander, Backbone, Marionette, $, _) {

      AddNewCampaign.Controller = {

        showAddNewCampaignModal: function() {

          //make new lander model for it
          var campaignModel = new CampaignModel();

          var addNewCampaignLayout = new AddNewCampaignLayoutView({
            model: campaignModel
          });

          addNewCampaignLayout.on("confirmAddCampaign", function(campaignModel) {

            //show loading
            campaignModel.set("alertLoading", true);

            campaignModel.save({}, {
              success: function(savedCampaignModel, serverResponse, options) {
                //remove loading
                campaignModel.set("alertLoading", false);

                if (serverResponse.error) {
                  
                    campaignModel.set("errorCode", serverResponse.error.code);
                    campaignModel.set("alertUnknownError", true);
                  
                } else {
                  //successfully saved new campaign
                  addNewCampaignLayout.onClose();

                  //now add it to the collection
                  Moonlander.trigger("campaigns:list:addCampaign", savedCampaignModel);
                }


              },
              error: function() {

              }
            });
          });


          addNewCampaignLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addNewCampaignLayout);

        }

      }
    });

    return Moonlander.CampaignsApp.Campaigns.AddNewCampaign.Controller;
  });
