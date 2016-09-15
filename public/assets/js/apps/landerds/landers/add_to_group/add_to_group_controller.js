define(["app",
    "assets/js/apps/landerds/landers/add_to_group/views/loading_view",
    "assets/js/apps/landerds/landers/add_to_group/views/groups_list_view",
    "assets/js/apps/landerds/landers/dao/active_group_model",
    "assets/js/apps/landerds/landers/add_to_group/views/add_to_group_layout_view",
    "assets/js/apps/landerds/groups/dao/group_collection"
  ],
  function(Landerds, LoadingView, GroupsListView, ActiveGroupsModel, AddToGroupsLayoutView) {
    Landerds.module("LandersApp.Landers.AddToGroups", function(AddToGroups, Landerds, Backbone, Marionette, $, _) {

      AddToGroups.Controller = {

        showAddNewGroups: function(landerModel) {

          var addGroupsToLanderLayout = new AddToGroupsLayoutView({
            model: landerModel
          });

          addGroupsToLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addGroupsToLanderLayout);

          addGroupsToLanderLayout.on("addGroupsToLander", function(groupModel) {

            //create an add the active group model to the lander
            var lander_id = landerModel.get("id");
            var domains = groupModel.get("domains");

            var newActiveGroupsModel = new ActiveGroupsModel({
              domains: domains,
              group_id: groupModel.get("id"),
              name: groupModel.get("name"),
              lander_id: lander_id,
              action: "lander"
            });

            var activeGroupsCollection = landerModel.get("activeGroups");
            activeGroupsCollection.add(newActiveGroupsModel);

            var domainListToDeploy = [];

            if (domains.length > 0) {

              domains.each(function(domain) {
                domainListToDeploy.push({
                  domain: domain.get("domain"),
                  domain_id: domain.get("domain_id"),
                  lander_id: lander_id
                });
              });
            } else {
              //push on a dummy object with key to say "dont try to add any domains before calling redeploy"
              domainListToDeploy.push({
                lander_id: lander_id,
                noDomainsToAdd: true
              });
            }

            Landerds.trigger("landers:deployLandersToDomain", {
              landerModel: landerModel,
              domainListToDeploy: domainListToDeploy
            });

          });

          //show loading
          var loadingView = new LoadingView();
          addGroupsToLanderLayout.groupsListRegion.show(loadingView)


          var deferredGroupsCollection = Landerds.request("groups:groupsCollection");

          $.when(deferredGroupsCollection).done(function(groupsCollection) {

            //filter this collection, take out groups that lander is already deployed to
            var filteredGroupsCollection = groupsCollection.filterOutGroups(landerModel.get("activeGroups"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var groupsListView = new GroupsListView({
              datatablesCollection: filteredGroupsCollection
            });


            //show actual view
            addGroupsToLanderLayout.groupsListRegion.show(groupsListView)

          });
        }
      }
    });

    return Landerds.LandersApp.Landers.AddToGroups.Controller;
  });
