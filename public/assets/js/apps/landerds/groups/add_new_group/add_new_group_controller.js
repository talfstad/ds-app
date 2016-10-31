define(["app",
    "assets/js/apps/landerds/groups/add_new_group/views/add_new_group_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model",
    "assets/js/apps/landerds/groups/dao/group_model"
  ],
  function(Landerds, AddNewGroupLayoutView, JobModel, GroupModel) {
    Landerds.module("GroupsApp.Groups.AddNewGroup", function(AddNewGroup, Landerds, Backbone, Marionette, $, _) {

      AddNewGroup.Controller = {

        showAddNewGroupModal: function() {

          //make new lander model for it
          var groupModel = new GroupModel();

          var addNewGroupLayout = new AddNewGroupLayoutView({
            model: groupModel
          });

          addNewGroupLayout.on("confirmAddGroup", function(groupModel) {

            //show loading
            groupModel.set("alertLoading", true);

            groupModel.save({}, {
              success: function(savedGroupModel, serverResponse, options) {
                //remove loading
                if (serverResponse.error) {
                  
                    groupModel.set("errorCode", serverResponse.error.code);
                    groupModel.set("alertUnknownError", true);
                  
                } else {
                  //successfully saved new group
                  addNewGroupLayout.onClose();

                  //now add it to the collection
                  Landerds.trigger("groups:list:addGroup", savedGroupModel);
                }
                groupModel.set("alertLoading", false);
                

              },
              error: function() {

              }
            });
          });


          addNewGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewGroupLayout);

        }

      }
    });

    return Landerds.GroupsApp.Groups.AddNewGroup.Controller;
  });
