define(["app",
    "assets/js/apps/landerds/domains/add_to_campaign/views/loading_view",
    "assets/js/apps/landerds/domains/add_to_campaign/views/campaigns_list_view",
    "assets/js/apps/landerds/domains/dao/active_campaign_model",
    "assets/js/apps/landerds/domains/add_to_campaign/views/add_to_campaign_layout_view",
    "assets/js/apps/landerds/domains/dao/campaign_collection"
  ],
  function(Landerds, LoadingView, CampaignsListView, ActiveCampaignModel, AddToCampaignLayoutView) {
    Landerds.module("DomainsApp.Domains.AddToCampaign", function(AddToCampaign, Landerds, Backbone, Marionette, $, _) {

      AddToCampaign.Controller = {

        showAddNewCampaign: function(domainModel) {

          var addCampaignToDomainLayout = new AddToCampaignLayoutView({
            model: domainModel
          });

          var domain_id = domainModel.get("id");

          addCampaignToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addCampaignToDomainLayout);

          addCampaignToDomainLayout.on("addCampaignToDomain", function(campaignAttributes) {
            
            //taking a campaign model and making it an active campaign model
            campaignAttributes.campaign_id = campaignAttributes.id;
            campaignAttributes.domain_id = domainModel.get("id");
            
            //callback
            var addedDomainToCampaignSuccessCallback = function(activeCampaignModel) {

              //save this lander to landers_with_campaigns
              var deployCampaignToDomainAttrs = {
                active_campaign_model: activeCampaignModel,
                domain_model: domainModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("domains:deployCampaignLandersToDomain", deployCampaignToDomainAttrs);

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
          addCampaignToDomainLayout.campaignsListRegion.show(loadingView)
        
         
          var deferredCampaignsCollection = Landerds.request("domains:campaignsCollection");

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
