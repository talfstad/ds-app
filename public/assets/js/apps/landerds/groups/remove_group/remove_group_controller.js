define(["app",
    "assets/js/apps/landerds/groups/remove_group/views/remove_group_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromGroupsLayout, JobModel) {
    Landerds.module("GroupsApp.Groups.RemoveGroups", function(RemoveGroups, Landerds, Backbone, Marionette, $, _) {

      RemoveGroups.Controller = {

        showRemoveGroups: function(groupModel) {
          var group_id = groupModel.get("id");

          var removeGroupsLayout = new RemoveLanderFromGroupsLayout({
            model: groupModel
          });

          removeGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeGroupsLayout);

          removeGroupsLayout.on("removeGroupsConfirm", function() {

            //1. create a deleteGroups job add to active jobs for group

            var jobAttributes = {
              action: "deleteGroups",
              group_id: group_id,
              deploy_status: "deleting"
            };

            var jobModel = new JobModel(jobAttributes);

            var activeJobs = groupModel.get("activeJobs");
            activeJobs.add(jobModel);

            Landerds.trigger("job:start", jobModel);

            

          });

        }

      }
    });

    return Landerds.GroupsApp.Groups.RemoveGroups.Controller;
  });
