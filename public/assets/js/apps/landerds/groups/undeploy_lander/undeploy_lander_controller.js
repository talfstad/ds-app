define(["app",
    "assets/js/apps/landerds/groups/undeploy_lander/views/undeploy_lander_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, RemoveLanderFromGroupsLayout, JobModel) {
    Landerds.module("GroupsApp.Groups.RemoveLander", function(RemoveLander, Landerds, Backbone, Marionette, $, _) {

      RemoveLander.Controller = {

        showUndeployLander: function(attr) {
          var groupModel = attr.group_model;
          var deployedLanderModel = attr.lander_model;
          var group_id = groupModel.get("id");

          var removeLanderFromGroupsLayout = new RemoveLanderFromGroupsLayout({
            group_model: groupModel,
            lander_model: deployedLanderModel
          });

          removeLanderFromGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeLanderFromGroupsLayout);

          //on add save the camp to db
          removeLanderFromGroupsLayout.on("removeLanderFromGroupsConfirm", function() {
            //just destroy it to unattach it
            deployedLanderModel.destroy();
          });
        }

      }
    });

    return Landerds.GroupsApp.Groups.RemoveLander.Controller;
  });
