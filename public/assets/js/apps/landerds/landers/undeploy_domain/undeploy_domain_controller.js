define(["app",
    "assets/js/apps/landerds/landers/undeploy_domain/views/undeploy_domain_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, RemoveDomainLayout, JobModel) {
    Landerds.module("LandersApp.Landers.List.Lander.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Controller = {

        showRemoveDomain: function(attr) {
          var landerModel = attr.lander_model;
          var deployedDomainModel = attr.domain_model;

          var removeDomainLayout = new RemoveDomainLayout({
            lander_model: landerModel,
            domain_model: deployedDomainModel
          });

          removeDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(removeDomainLayout);

          //on add save the camp to db
          removeDomainLayout.on("removeDomainConfirm", function() {
            var domain_id = deployedDomainModel.get("domain_id");

            var undeployAttr = {
              landerModel: landerModel,
              undeployDomainIdsArr: [domain_id]
            };

            Landerds.trigger("landers:undeployLanderFromDomains", undeployAttr);
            
          });
        }
      }
    });

    return Landerds.LandersApp.Landers.List.Lander.RemoveDomain.Controller;
  });
