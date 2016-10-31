define(["app",
    "assets/js/apps/landerds/groups/undeploy_domain/views/undeploy_domain_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, RemoveDomainFromGroupsLayout, JobModel) {
    Landerds.module("GroupsApp.Groups.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Controller = {

        showUndeployDomain: function(attr) {
          var groupModel = attr.group_model;
          var domainListModel = attr.domain_model;
          var group_id = groupModel.get("id");

          var removeDomainFromGroupLayout = new RemoveDomainFromGroupsLayout({
            group_model: groupModel,
            domain_model: domainListModel
          });

          removeDomainFromGroupLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainFromGroupLayout);

          //on add save the camp to db
          removeDomainFromGroupLayout.on("removeDomainFromGroupsConfirm", function() {

            //just destroy it to unattach it
            domainListModel.destroy();

          });


        }

      }
    });

    return Landerds.GroupsApp.Groups.RemoveDomain.Controller;
  });
