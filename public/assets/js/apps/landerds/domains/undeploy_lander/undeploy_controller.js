define(["app",
    "assets/js/apps/landerds/domains/undeploy_lander/views/undeploy_layout_view",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, UndeployLayoutView, JobModel) {
    Landerds.module("DomainsApp.Domains.List.Lander.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Controller = {

        showUndeployLander: function(model) {

          var undeployLanderLayout = new UndeployLayoutView({
            model: model
          });
          undeployLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(undeployLanderLayout);


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

            Landerds.trigger("job:start", jobModel);

          });

        }

      }
    });

    return Landerds.DomainsApp.Domains.List.Lander.Undeploy.Controller;
  });
