define(["app",
    "assets/js/apps/landerds/landers/undeploy_group/views/undeploy_group_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("LandersApp.Landers.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromGroupDialog: function(attr) {
          var activeGroupModel = attr.group_model;
          var landerModel = attr.lander_model;
          var group_id = activeGroupModel.get("group_id");

          var removeDomainFromGroupLayout = new UndeployLayoutView({
            group_model: activeGroupModel,
            lander_model: landerModel
          });

          removeDomainFromGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromGroupLayout);

          removeDomainFromGroupLayout.on("removeGroupsFromLander", function() {
            //no landers on group so nothing needs to be undeployed. just destroy it
            activeGroupModel.destroy();
          });
        }

      }
    });

    return Landerds.LandersApp.Landers.List.Groups.Undeploy.Controller;
  });
