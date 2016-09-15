define(["app",
    "assets/js/apps/landerds/domains/undeploy_group/views/undeploy_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("DomainsApp.Domains.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromGroupsDialog: function(attr) {
          var activeGroupsModel = attr.group_model;
          var domainModel = attr.domain_model;
          var group_id = activeGroupsModel.get("group_id");

          var removeDomainFromGroupsLayout = new UndeployLayoutView({
            group_model: activeGroupsModel,
            domain_model: domainModel
          });

          removeDomainFromGroupsLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromGroupsLayout);

          removeDomainFromGroupsLayout.on("removeGroupsFromDomain", function() {
            //no landers on group so nothing needs to be undeployed. just destroy it
            activeGroupsModel.destroy();
          });
        }

      }
    });

    return Landerds.DomainsApp.Domains.List.Groups.Undeploy.Controller;
  });
