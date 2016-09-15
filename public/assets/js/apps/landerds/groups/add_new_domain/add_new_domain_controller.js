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

          var group_id = groupModel.get("id");

          var deployLanderToDomainLayout = new AddNewDomainLayoutView({
            model: groupModel
          });

          deployLanderToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);
          

          deployLanderToDomainLayout.on("addDomainToGroups", function(domainAttributes) {

            //taking a lander model and making it a deployed lander model
            domainAttributes.domain_id = domainAttributes.id;
            domainAttributes.group_id = group_id;
            
            //callback
            var addedDomainToGroupsSuccessCallback = function(domainListModel) {

              //save this lander to landers_with_groups
              var deployGroupsLandersToDomainAttrs = {
                domain_list_model: domainListModel,
                group_model: groupModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("groups:deployGroupsLandersToDomain", deployGroupsLandersToDomainAttrs);

            };
            var addedDomainToGroupsErrorCallback = function(err, two, three) {

            };

            //add the group to the domain first, on success close dialog
            var domainListModel = new DomainListModel(domainAttributes);
            domainListModel.unset("id");

            // create the model for activeGroups model. make sure it saves to
            domainListModel.save({}, {
              success: addedDomainToGroupsSuccessCallback,
              error: addedDomainToGroupsErrorCallback
            });

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
