define(["app",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/loading_view",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/landers_list_view",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/deploy_new_lander_layout_view",
    "assets/js/apps/landerds/domains/dao/lander_collection"
  ],
  function(Landerds, LoadingView, LandersListView, DeployLanderLayoutView) {
    Landerds.module("DomainsApp.Domains.DeployNewLander", function(DeployNewLander, Landerds, Backbone, Marionette, $, _) {

      DeployNewLander.Controller = {

        showDeployNewLander: function(model) {

          var deployLanderToDomainLayout = new DeployLanderLayoutView({
            model: model
          });

          deployLanderToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          
          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.landersListRegion.show(loadingView)
        
          //get all domains that this lander IS NOT currently deployed or deploying to

          //1. get all domains for user
          //2. create collection
          //3. filter it for domains its already deployed to


          var deferredLandersCollection = Landerds.request("domains:landersCollection");

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

    return Landerds.DomainsApp.Domains.DeployNewLander.Controller;
  });
