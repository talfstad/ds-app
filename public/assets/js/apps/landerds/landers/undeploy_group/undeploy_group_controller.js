define(["app",
    "assets/js/apps/landerds/landers/undeploy_group/views/undeploy_group_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("LandersApp.Landers.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromGroupsDialog: function(attr) {
          var activeGroupsModel = attr.group_model;
          var landerModel = attr.lander_model;
          var group_id = activeGroupsModel.get("group_id");

          var removeDomainFromGroupsLayout = new UndeployLayoutView({
            group_model: activeGroupsModel,
            lander_model: landerModel
          });

          removeDomainFromGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromGroupsLayout);

          removeDomainFromGroupsLayout.on("removeGroupsFromLander", function() {
            //no landers on group so nothing needs to be undeployed. just destroy it
            activeGroupsModel.destroy();
          });
        }

      }
    });

    return Landerds.LandersApp.Landers.List.Groups.Undeploy.Controller;
  });
