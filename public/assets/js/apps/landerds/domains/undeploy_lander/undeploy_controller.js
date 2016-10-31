define(["app",
    "assets/js/apps/landerds/domains/undeploy_lander/views/undeploy_layout_view",
    "assets/js/apps/landerds/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("DomainsApp.Domains.List.Lander.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployLander: function(attr) {

          var domainModel = attr.domainModel;
          var deployedLanderModel = attr.deployedLanderModel;

          var undeployLanderLayout = new UndeployLayoutView({
            domain_model: domainModel,
            lander_model: deployedLanderModel
          });

          undeployLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(undeployLanderLayout);


          undeployLanderLayout.on("undeployLanderConfirm", function() {
            var lander_id = deployedLanderModel.get("lander_id");

            var undeployAttr = {
              domainModel: domainModel,
              undeployLanderIdsArr: [lander_id]
            };

            Landerds.trigger("domains:undeployLandersFromDomain", undeployAttr);

          });

        }

      }
    });

    return Landerds.DomainsApp.Domains.List.Lander.Undeploy.Controller;
  });
