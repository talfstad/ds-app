define(["app",
    "assets/js/apps/moonlander/landers/deploy_to_domain/views/loading_view",
    "assets/js/apps/moonlander/landers/deploy_to_domain/views/domains_list_view",
    "assets/js/apps/moonlander/landers/deploy_to_domain/views/deploy_to_domain_layout_view",
    "assets/js/apps/moonlander/landers/dao/domain_collection"
  ],
  function(Moonlander, LoadingView, DomainsListView, DeployToDomainLayoutView) {
    Moonlander.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Moonlander, Backbone, Marionette, $, _) {

      DeployToDomain.Controller = {

        showDeployLanderToDomain: function(model) {

          var deployLanderToDomainLayout = new DeployToDomainLayoutView({
            model: model
          });

          deployLanderToDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          
          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.domainsListRegion.show(loadingView)
        
          //get all domains that this lander IS NOT currently deployed or deploying to

          //1. get all domains for user
          //2. create collection
          //3. filter it for domains its already deployed to


          var deferredDomainsCollection = Moonlander.request("landers:domainsCollection");

          $.when(deferredDomainsCollection).done(function(domainsCollection) {

            //filter this collection, take out domains that lander is already deployed to
            var filteredDomainsCollection = domainsCollection.filterOutDomains(model.get("deployedDomains"));

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

    return Moonlander.LandersApp.Landers.DeployToDomain.Controller;
  });
