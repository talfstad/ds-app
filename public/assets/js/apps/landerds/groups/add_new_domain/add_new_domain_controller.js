define(["app",
    "assets/js/apps/landerds/groups/add_new_domain/views/loading_view",
    "assets/js/apps/landerds/groups/add_new_domain/views/domains_list_view",
    "assets/js/apps/landerds/groups/add_new_domain/views/add_new_domain_layout_view",
    "assets/js/apps/landerds/groups/dao/domain_list_model",
    "assets/js/apps/landerds/groups/dao/domain_list_collection"
  ],
  function(Landerds, LoadingView, DomainsListView, AddNewDomainLayoutView, DomainListModel) {
    Landerds.module("LandersApp.Landers.DeployToDomain", function(DeployToDomain, Landerds, Backbone, Marionette, $, _) {

      DeployToDomain.Controller = {

        showAddNewDomain: function(groupModel) {

          var deployLanderToDomainLayout = new AddNewDomainLayoutView({
            model: groupModel
          });

          deployLanderToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);


          deployLanderToDomainLayout.on("addDomainToGroup", function(domainModel) {

            //setting in group for server to ADD GROUP
            groupModel.set({
              "action": "domain",
              "domain_id": domainModel.get("id")
            });

            //add the domain to the group
            var domainCollection = groupModel.get("domains");

            var newDomainModel = new DomainListModel({
              domain_id: domainModel.get("id"),
              domain: domainModel.get("domain")
            });

            domainCollection.add(newDomainModel);

            Landerds.trigger("groups:deployNewInGroup", groupModel);

          });

          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.domainsListRegion.show(loadingView)

          var deferredDomainsCollection = Landerds.request("domains:domainsCollection");

          $.when(deferredDomainsCollection).done(function(domainsCollection) {

            //filter this collection, take out domains that lander is already deployed to
            var filteredDomainsCollection = domainsCollection.filterOutDomains(groupModel.get("domains"));

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
