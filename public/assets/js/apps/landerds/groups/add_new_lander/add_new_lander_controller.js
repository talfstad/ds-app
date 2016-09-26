define(["app",
    "assets/js/apps/landerds/groups/add_new_lander/views/loading_view",
    "assets/js/apps/landerds/groups/add_new_lander/views/landers_list_view",
    "assets/js/apps/landerds/groups/add_new_lander/views/add_new_lander_layout_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/apps/landerds/landers/dao/lander_collection"
  ],
  function(Landerds, LoadingView, LandersListView, AddLanderToGroupsLayout, DeployedLanderModel) {
    Landerds.module("GroupsApp.Groups.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLander: function(groupModel) {

          var addLanderToGroupsLayout = new AddLanderToGroupsLayout({
            model: groupModel
          });

          addLanderToGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addLanderToGroupsLayout);

          //on add save the camp to db
          addLanderToGroupsLayout.on("addLanderToGroups", function(landerModel) {
            
            //setting in group for server to ADD GROUP
            groupModel.set({
              "action": "lander",
              "lander_id": landerModel.get("id")
            });

            //add the lander to the group
            var deployedLanders = groupModel.get("deployedLanders");

            //delete deployedDomain jobs
            var deployedDomains = landerModel.get("deployedDomains");
            deployedDomains.each(function(deployedDomain) {
              deployedDomain.unset("activeJobs");
            });

            var newDeployedLanderModel = new DeployedLanderModel({
              name: landerModel.get("name"),
              deployment_folder_name: landerModel.get("deployment_folder_name"),
              modified: landerModel.get("modified"),
              lander_id: landerModel.get("id"),
              urlEndpoints: landerModel.get("urlEndpoints"),
              endpoint_load_times: landerModel.get("endpoint_load_times"),
              deployedDomains: deployedDomains
            });

            deployedLanders.add(newDeployedLanderModel);

            Landerds.trigger("groups:deployNewInGroup", groupModel);

          });


          //show loading
          var loadingView = new LoadingView();
          addLanderToGroupsLayout.landersListRegion.show(loadingView);

          var deferredLandersCollection = Landerds.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            //filter this collection, take out landers that group is already deployed to
            var filteredLandersCollection = landersCollection.filterOutLanders(groupModel.get("deployedLanders"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var landersListView = new LandersListView({
              datatablesCollection: filteredLandersCollection
            });

            //show actual view
            addLanderToGroupsLayout.landersListRegion.show(landersListView);

          });

        }

      }
    });

    return Landerds.GroupsApp.Groups.AddNewLander.Controller;
  });
