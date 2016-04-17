define(["app",
    "/assets/js/apps/moonlander/domains/undeploy_lander/views/undeploy_layout_view.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, UndeployLayoutView, JobModel) {
    Moonlander.module("DomainsApp.Domains.List.Lander.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployLander: function(model) {

          var undeployLanderLayout = new UndeployLayoutView({
            model: model
          });
          undeployLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(undeployLanderLayout);


          undeployLanderLayout.on("undeployLanderFromDomain", function(model) {

            var jobAttributes = {
              action: "undeployLanderFromDomain",
              lander_id: model.get("lander_id") || model.get("id"),
              domain_id: model.get("domain_id"),
              deploy_status: "undeploying"
            }

            //create job and add to models activeJobs
            var jobModel = new JobModel(jobAttributes);
            var activeJobsCollection = this.model.get("activeJobs");
            activeJobsCollection.add(jobModel);

            Moonlander.trigger("job:start", jobModel);

          });

        }

      }
    });

    return Moonlander.DomainsApp.Domains.List.Lander.Undeploy.Controller;
  });
