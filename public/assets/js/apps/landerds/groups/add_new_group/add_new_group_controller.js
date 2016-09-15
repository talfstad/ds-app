define(["app",
    "assets/js/apps/landerds/groups/add_new_group/views/add_new_group_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/groups/dao/group_model"
  ],
  function(Landerds, AddNewGroupsLayoutView, JobModel, GroupsModel) {
    Landerds.module("GroupsApp.Groups.AddNewGroups", function(AddNewGroups, Landerds, Backbone, Marionette, $, _) {

      AddNewGroups.Controller = {

        showAddNewGroupsModal: function() {

          //make new lander model for it
          var groupModel = new GroupsModel();

          var addNewGroupsLayout = new AddNewGroupsLayoutView({
            model: groupModel
          });

          addNewGroupsLayout.on("confirmAddGroups", function(groupModel) {

            //show loading
            groupModel.set("alertLoading", true);

            groupModel.save({}, {
              success: function(savedGroupsModel, serverResponse, options) {
                //remove loading
                if (serverResponse.error) {
                  
                    groupModel.set("errorCode", serverResponse.error.code);
                    groupModel.set("alertUnknownError", true);
                  
                } else {
                  //successfully saved new group
                  addNewGroupsLayout.onClose();

                  //now add it to the collection
                  Landerds.trigger("groups:list:addGroups", savedGroupsModel);
                }
                groupModel.set("alertLoading", false);
                

              },
              error: function() {

              }
            });
          });


          addNewGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewGroupsLayout);

        }

      }
    });

    return Landerds.GroupsApp.Groups.AddNewGroups.Controller;
  });
