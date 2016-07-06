define(["app",
    "assets/js/apps/landerds/campaigns/add_new_domain/views/loading_view",
    "assets/js/apps/landerds/campaigns/add_new_domain/views/domains_list_view",
    "assets/js/apps/landerds/campaigns/add_new_domain/views/add_new_domain_layout_view",
    "assets/js/apps/landerds/campaigns/dao/deployed_domain_model",
    "assets/js/apps/landerds/campaigns/dao/domain_collection"
  ],
  function(Landerds, LoadingView, DomainsListView, AddNewDomainLayoutView, DeployedDomainModel) {
    Landerds.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Landerds, Backbone, Marionette, $, _) {

      DeployToDomain.Controller = {

        showAddNewDomain: function(campaignModel) {

          var campaign_id = campaignModel.get("id");

          var deployLanderToDomainLayout = new AddNewDomainLayoutView({
            model: campaignModel
          });

          deployLanderToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          

          deployLanderToDomainLayout.on("addDomainToCampaign", function(domainAttributes) {

            //taking a lander model and making it a deployed lander model
            domainAttributes.domain_id = domainAttributes.id;
            domainAttributes.campaign_id = campaign_id;
            
            //callback
            var addedDomainToCampaignSuccessCallback = function(deployedDomainModel) {

              //save this lander to landers_with_campaigns
              var deployCampaignLandersToDomainAttrs = {
                deployed_domain_model: deployedDomainModel,
                campaign_model: campaignModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("campaigns:deployCampaignLandersToDomain", deployCampaignLandersToDomainAttrs);

            };
            var addedDomainToCampaignErrorCallback = function(err, two, three) {

            };

            //add the campaign to the domain first, on success close dialog
            var deployedDomainModel = new DeployedDomainModel(domainAttributes);
            deployedDomainModel.unset("id");

            // create the model for activeCampaign model. make sure it saves to
            deployedDomainModel.save({}, {
              success: addedDomainToCampaignSuccessCallback,
              error: addedDomainToCampaignErrorCallback
            });

          });

          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.domainsListRegion.show(loadingView)
        
          var deferredDomainsCollection = Landerds.request("campaigns:domainsCollection");

          $.when(deferredDomainsCollection).done(function(domainsCollection) {

            //filter this collection, take out domains that lander is already deployed to
            var filteredDomainsCollection = domainsCollection.filterOutDomains(campaignModel.get("deployedDomains"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var domainsListView = new DomainsListView({
              datatablesCollection: filteredDomainsCollection
            });


            //show actual view
            deployLanderToDomainLayout.domainsListRegion.show(domainsListView)


          });


          deployLanderToDomainLayout.on("deployLanderToDomain", function(model) {


          });

        }

      }
    });

    return Landerds.LandersApp.Landers.DeployToDomain.Controller;
  });