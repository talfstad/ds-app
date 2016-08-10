define(["app",
    "assets/js/apps/landerds/campaigns/add_new_campaign/views/add_new_campaign_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/campaigns/dao/campaign_model"
  ],
  function(Landerds, AddNewCampaignLayoutView, JobModel, CampaignModel) {
    Landerds.module("CampaignsApp.Campaigns.AddNewCampaign", function(AddNewCampaign, Landerds, Backbone, Marionette, $, _) {

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
                if (serverResponse.error) {
                  
                    campaignModel.set("errorCode", serverResponse.error.code);
                    campaignModel.set("alertUnknownError", true);
                  
                } else {
                  //successfully saved new campaign
                  addNewCampaignLayout.onClose();

                  //now add it to the collection
                  Landerds.trigger("campaigns:list:addCampaign", savedCampaignModel);
                }
                campaignModel.set("alertLoading", false);
                

              },
              error: function() {

              }
            });
          });


          addNewCampaignLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewCampaignLayout);

        }

      }
    });

    return Landerds.CampaignsApp.Campaigns.AddNewCampaign.Controller;
  });
