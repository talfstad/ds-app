define(["app",
    "assets/js/apps/landerds/groups/delete_group/views/delete_group_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromGroupLayout, JobModel) {
    Landerds.module("GroupsApp.Groups.RemoveGroups", function(RemoveGroups, Landerds, Backbone, Marionette, $, _) {

      RemoveGroups.Controller = {

        showRemoveGroups: function(groupModel) {
          var group_id = groupModel.get("id");

          var deleteGroupLayout = new RemoveLanderFromGroupLayout({
            model: groupModel
          });

          deleteGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deleteGroupLayout);

          deleteGroupLayout.on("unattachGroupConfirm", function() {
            //delete the group
            groupModel.destroy({
              success: function(one, two, three) {
                //nothing
              }
            });
          });

        }

      }
    });

    return Landerds.GroupsApp.Groups.RemoveGroups.Controller;
  });
