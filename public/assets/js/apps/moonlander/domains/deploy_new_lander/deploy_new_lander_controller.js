define(["app",
    "assets/js/apps/moonlander/domains/deploy_new_lander/views/loading_view",
    "assets/js/apps/moonlander/domains/deploy_new_lander/views/landers_list_view",
    "assets/js/apps/moonlander/domains/deploy_new_lander/views/deploy_new_lander_layout_view",
    "assets/js/apps/moonlander/domains/dao/lander_collection"
  ],
  function(Moonlander, LoadingView, LandersListView, DeployLanderLayoutView) {
    Moonlander.module("DomainsApp.Domains.DeployNewLander", function(DeployNewLander, Moonlander, Backbone, Marionette, $, _) {

      DeployNewLander.Controller = {

        showDeployNewLander: function(model) {

          var deployLanderToDomainLayout = new DeployLanderLayoutView({
            model: model
          });

          deployLanderToDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          
          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.landersListRegion.show(loadingView)
        
          //get all domains that this lander IS NOT currently deployed or deploying to

          //1. get all domains for user
          //2. create collection
          //3. filter it for domains its already deployed to


          var deferredLandersCollection = Moonlander.request("domains:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            //filter this collection, take out domains that lander is already deployed to
            var filteredLandersCollection = landersCollection.filterOutLanders(model.get("deployedLanders"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var landersListView = new LandersListView({
              datatablesCollection: filteredLandersCollection
            });


            //show actual view
            deployLanderToDomainLayout.landersListRegion.show(landersListView)


          });


        }

      }
    });

    return Moonlander.DomainsApp.Domains.DeployNewLander.Controller;
  });
