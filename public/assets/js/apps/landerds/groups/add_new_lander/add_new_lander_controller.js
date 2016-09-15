define(["app",
    "assets/js/apps/landerds/groups/add_new_lander/views/loading_view",
    "assets/js/apps/landerds/groups/add_new_lander/views/landers_list_view",
    "assets/js/apps/landerds/groups/add_new_lander/views/add_new_lander_layout_view",
    "assets/js/apps/landerds/groups/dao/deployed_lander_model",
    "assets/js/apps/landerds/groups/dao/lander_collection"
  ],
  function(Landerds, LoadingView, LandersListView, AddLanderToGroupsLayout, DeployedLanderModel) {
    Landerds.module("GroupsApp.Groups.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLander: function(groupModel) {

          var group_id = groupModel.get("id");

          var addLanderToGroupsLayout = new AddLanderToGroupsLayout({
            model: groupModel
          });

          addLanderToGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addLanderToGroupsLayout);

          //on add save the camp to db
          addLanderToGroupsLayout.on("addLanderToGroups", function(landerAttributes) {

            //taking a lander model and making it a deployed lander model
            landerAttributes.lander_id = landerAttributes.id;
            landerAttributes.group_id = group_id;

            //callback
            var addedLanderToGroupsSuccessCallback = function(deployedLanderModel) {

              //save this lander to landers_with_groups
              var deployLanderToGroupsDomainsAttrs = {
                deployed_lander_model: deployedLanderModel,
                group_model: groupModel
              };

              // triggers add row to deployed domains and starts job 
              Landerds.trigger("groups:deployLanderToGroupsDomains", deployLanderToGroupsDomainsAttrs);

            };
            var addedLanderToGroupsErrorCallback = function(err, two, three) {

            };

            //add the group to the domain first, on success close dialog
            var deployedLanderModel = new DeployedLanderModel(landerAttributes);
            deployedLanderModel.unset("id");
            
            // create the model for activeGroups model. make sure it saves to
            // /api/active_groups
            deployedLanderModel.save({}, {
              success: addedLanderToGroupsSuccessCallback,
              error: addedLanderToGroupsErrorCallback
            });

          });


          //show loading
          var loadingView = new LoadingView();
          addLanderToGroupsLayout.landersListRegion.show(loadingView);

          var deferredLandersCollection = Landerds.request("groups:landersCollection");

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
