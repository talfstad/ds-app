define(["app",
    "/assets/js/apps/moonlander/domains/add_new_domain/views/add_new_domain_layout_view.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/domains/dao/lander_model.js"
  ],
  function(Moonlander, RipNewLanderLayoutView, JobModel, LanderModel) {
    Moonlander.module("DomainsApp.Domains.AddNewDomain", function(AddNewDomain, Moonlander, Backbone, Marionette, $, _) {

      AddNewDomain.Controller = {

        showAddNewDomainModal: function() {

          //make new lander model for it
          var jobModel = new JobModel({
            action: "ripNewLander"
          });

          var ripNewLanderLayout = new RipNewLanderLayoutView({
            model: jobModel
          });

          ripNewLanderLayout.on("confirmAddDomain", function(jobModel) {
            //1. create a new lander model
            var landerModel = new LanderModel({
              id: jobModel.get("lander_id"),
              name: jobModel.get("lander_name"),
              last_updated: jobModel.get("last_updated"),
              deploy_status: "initializing",
              lander_url: jobModel.get("lander_url")
            });
            //2. add jobmodel to lander model
            var activeJobs = landerModel.get("activeJobs");
            activeJobs.add(jobModel);
            Moonlander.trigger("job:start", jobModel);
            //3. trigger add lander model on the landers collection
            Moonlander.trigger("domains:list:addLander", landerModel);
          });


          ripNewLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Moonlander.DomainsApp.Domains.AddNewDomain.Controller;
  });
