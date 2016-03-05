define(["app",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/views/loading_view.js",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/views/domains_list_view.js",
    "/assets/js/apps/moonlander/campaigns/add_new_domain/views/add_new_domain_layout_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/domain_collection.js"
  ],
  function(Moonlander, LoadingView, DomainsListView, AddNewDomainLayoutView) {
    Moonlander.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Moonlander, Backbone, Marionette, $, _) {

      DeployToDomain.Controller = {

        showAddNewDomain: function(model) {

          var deployLanderToDomainLayout = new AddNewDomainLayoutView({
            model: model
          });

          deployLanderToDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          
          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.domainsListRegion.show(loadingView)
        
          var deferredDomainsCollection = Moonlander.request("campaigns:domainsCollection");

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
