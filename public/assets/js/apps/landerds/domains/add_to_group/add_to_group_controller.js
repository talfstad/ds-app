define(["app",
    "assets/js/apps/landerds/domains/add_to_group/views/loading_view",
    "assets/js/apps/landerds/domains/add_to_group/views/groups_list_view",
    "assets/js/apps/landerds/domains/dao/active_group_model",
    "assets/js/apps/landerds/domains/add_to_group/views/add_to_group_layout_view",
    "assets/js/apps/landerds/groups/dao/group_collection"
  ],
  function(Landerds, LoadingView, GroupListView, ActiveGroupModel, AddToGroupLayoutView) {
    Landerds.module("DomainsApp.Domains.AddToGroup", function(AddToGroup, Landerds, Backbone, Marionette, $, _) {

      AddToGroup.Controller = {

        showAddNewGroup: function(domainModel) {

          var addGroupToDomainLayout = new AddToGroupLayoutView({
            model: domainModel
          });

          addGroupToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addGroupToDomainLayout);

          addGroupToDomainLayout.on("addGroupToDomain", function(groupModel) {

            //create an add the active group model to the lander
            var domain_id = domainModel.get("id");
            var deployedLanderCollection = groupModel.get("deployedLanders");

            //add this domain as a new domain for this group model
            var domains = groupModel.get("domains");
            domains.push({
              domain_id: domain_id,
              domain: domainModel.get("domain")
            });

            var newActiveGroupModel = new ActiveGroupModel({
              deployedLanders: deployedLanderCollection,
              group_id: groupModel.get("id"),
              name: groupModel.get("name"),
              domain_id: domain_id,
              action: "domain",
              domains: domains,
              landers: deployedLanderCollection.toJSON()

            });

            var activeGroupCollection = domainModel.get("activeGroups");
            activeGroupCollection.add(newActiveGroupModel);

            var listToDeploy = [];

            if (deployedLanderCollection.length > 0) {

              deployedLanderCollection.each(function(deployedLander) {
                listToDeploy.push({
                  name: deployedLander.get("name"),
                  domain_id: domain_id,
                  group_id: groupModel.get("id"),
                  modified: deployedLander.get("modified"),
                  lander_id: deployedLander.get("lander_id"),
                  deployedDomains: deployedLander.get("deployedDomains"),
                  urlEndpoints: deployedLander.get("urlEndpoints"),
                  deployment_folder_name: deployedLander.get("deployment_folder_name"),
                  endpoint_load_times: deployedLander.get("endpoint_load_times")
                });
              });

            } else {
              //push on a dummy object with key to say "dont try to add any domains before calling redeploy"
              listToDeploy.push({
                domain_id: domain_id,
                noLandersToAdd: true
              });
            }

            Landerds.trigger("domains:deployLandersToDomain", {
              model: domainModel,
              listToDeploy: listToDeploy
            });
          });

          //show loading
          var loadingView = new LoadingView();
          addGroupToDomainLayout.groupListRegion.show(loadingView)


          var deferredGroupCollection = Landerds.request("groups:groupCollection");

          $.when(deferredGroupCollection).done(function(groupCollection) {

            //filter this collection, take out groups that lander is already deployed to
            var filteredGroupCollection = groupCollection.filterOutGroups(domainModel.get("activeGroups"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var groupListView = new GroupListView({
              datatablesCollection: filteredGroupCollection
            });


            //show actual view
            addGroupToDomainLayout.groupListRegion.show(groupListView)

          });
        }
      }
    });

    return Landerds.DomainsApp.Domains.AddToGroup.Controller;
  });
