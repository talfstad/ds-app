define(["app",
    "assets/js/apps/landerds/groups/remove_group/views/remove_group_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromGroupLayout, JobModel) {
    Landerds.module("GroupsApp.Groups.RemoveGroups", function(RemoveGroups, Landerds, Backbone, Marionette, $, _) {

      RemoveGroups.Controller = {

        showRemoveGroups: function(groupModel) {
          var group_id = groupModel.get("id");

          var removeGroupLayout = new RemoveLanderFromGroupLayout({
            model: groupModel
          });

          removeGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeGroupLayout);

          removeGroupLayout.on("removeGroupConfirm", function() {

            //1. create a deleteGroup job add to active jobs for group

            var jobAttributes = {
              action: "deleteGroup",
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
