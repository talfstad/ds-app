define(["app",
    "/assets/js/apps/moonlander/landers/remove_domain/views/remove_domain_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, RemoveDomainLayout, JobModel) {
    Moonlander.module("LandersApp.Landers.List.Lander.RemoveDomain", function(RemoveDomain, Moonlander, Backbone, Marionette, $, _) {

      RemoveDomain.Controller = {

        showRemoveDomain: function(attr) {
          var landerModel = attr.lander_model;
          var deployedDomainModel = attr.domain_model;

          var removeDomainLayout = new RemoveDomainLayout({
            lander_model: landerModel,
            domain_model: deployedDomainModel
          });

          removeDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(removeDomainLayout);

          //on add save the camp to db
          removeDomainLayout.on("removeDomainConfirm", function() {

            var deployedDomainModelActiveJobs = deployedDomainModel.get("activeJobs");
            
            //create undeploy job for domain and add it to the domain and the lander model
            var jobAttributes = {
              action: "undeployLanderFromDomain",
              lander_id: landerModel.get("lander_id") || landerModel.get("id"),
              domain_id: deployedDomainModel.get("domain_id") || deployedDomainModel.get("id"),
            };

            var jobModel = new JobModel(jobAttributes);

            deployedDomainModelActiveJobs.add(jobModel);

            Moonlander.trigger("job:start", jobModel);

          });
        }
      }
    });

    return Moonlander.LandersApp.Landers.List.Lander.RemoveDomain.Controller;
  });
