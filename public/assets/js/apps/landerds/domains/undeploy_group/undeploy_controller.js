define(["app",
    "assets/js/apps/landerds/domains/undeploy_group/views/undeploy_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("DomainsApp.Domains.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployDomainFromGroupDialog: function(attr) {
          var activeGroupModel = attr.group_model;
          var domainModel = attr.domain_model;
          var group_id = activeGroupModel.get("group_id");

          var removeDomainFromGroupLayout = new UndeployLayoutView({
            group_model: activeGroupModel,
            domain_model: domainModel
          });

          removeDomainFromGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromGroupLayout);

          removeDomainFromGroupLayout.on("removeGroupFromDomain", function() {
            //no landers on group so nothing needs to be undeployed. just destroy it
            activeGroupModel.destroy();
          });
        }

      }
    });

    return Landerds.DomainsApp.Domains.List.Groups.Undeploy.Controller;
  });
