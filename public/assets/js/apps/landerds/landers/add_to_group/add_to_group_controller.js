define(["app",
    "assets/js/apps/landerds/landers/add_to_group/views/loading_view",
    "assets/js/apps/landerds/landers/add_to_group/views/groups_list_view",
    "assets/js/apps/landerds/landers/dao/active_group_model",
    "assets/js/apps/landerds/landers/add_to_group/views/add_to_group_layout_view",
    "assets/js/apps/landerds/groups/dao/group_collection"
  ],
  function(Landerds, LoadingView, GroupListView, ActiveGroupModel, AddToGroupLayoutView) {
    Landerds.module("LandersApp.Landers.AddToGroup", function(AddToGroup, Landerds, Backbone, Marionette, $, _) {

      AddToGroup.Controller = {

        showAddNewGroup: function(landerModel) {

          var addGroupToLanderLayout = new AddToGroupLayoutView({
            model: landerModel
          });

          addGroupToLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addGroupToLanderLayout);

          addGroupToLanderLayout.on("addGroupToLander", function(groupModel) {

            //create an add the active group model to the lander
            var lander_id = landerModel.get("id");
            var domains = groupModel.get("domains");

            var newActiveGroupModel = new ActiveGroupModel({
              domains: domains,
              group_id: groupModel.get("id"),
              name: groupModel.get("name"),
              lander_id: lander_id,
              action: "lander"
            });

            var activeGroupCollection = landerModel.get("activeGroups");
            activeGroupCollection.add(newActiveGroupModel);

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
          addGroupToLanderLayout.groupListRegion.show(loadingView)


          var deferredGroupCollection = Landerds.request("groups:groupCollection");

          $.when(deferredGroupCollection).done(function(groupCollection) {

            //filter this collection, take out groups that lander is already deployed to
            var filteredGroupCollection = groupCollection.filterOutGroups(landerModel.get("activeGroups"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var groupListView = new GroupListView({
              datatablesCollection: filteredGroupCollection
            });


            //show actual view
            addGroupToLanderLayout.groupListRegion.show(groupListView)

          });
        }
      }
    });

    return Landerds.LandersApp.Landers.AddToGroup.Controller;
  });
