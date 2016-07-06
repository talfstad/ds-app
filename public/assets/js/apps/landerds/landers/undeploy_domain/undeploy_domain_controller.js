define(["app",
    "assets/js/apps/landerds/landers/undeploy_domain/views/undeploy_domain_layout_view",
    "assets/js/jobs/jobs_model"
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

            var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");
            
            //create undeploy job for domain and add it to the domain and the lander model
            var jobAttributes = {
              action: "undeployLanderFromDomain",
              lander_id: landerModel.get("lander_id") || landerModel.get("id"),
              domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
              deploy_status: "undeploying"
            };

            var jobModel = new JobModel(jobAttributes);

            deployedDomainModelActiveJobs.add(jobModel);

            Landerds.trigger("job:start", jobModel);

          });
        }
      }
    });

    return Landerds.LandersApp.Landers.List.Lander.RemoveDomain.Controller;
  });