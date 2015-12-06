define(["app",
    "/assets/js/apps/moonlander/landers/duplicate_lander/views/duplicate_lander_layout_view.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js"
  ],
  function(Moonlander, DuplicateLanderLayoutView, JobModel, LanderModel) {
    Moonlander.module("LandersApp.Landers.DuplicateLander", function(DuplicateLander, Moonlander, Backbone, Marionette, $, _) {

      DuplicateLander.Controller = {

        showDuplicateLander: function(landerModelToDuplicate) {

          //make new lander model for it
          var jobModel = new JobModel({
            action: "duplicateLander"
          });

          var duplicateLanderLayout = new DuplicateLanderLayoutView({
            model: landerModelToDuplicate
          });

          duplicateLanderLayout.on("duplicateLander", function(data){

            //1. save the lander as a new lander


            //2. 



            var jobAttributes = data.response;
             //// server returns job id, lander id
            //2. create new jobmodel with jobid and action and lander id
            var jobModel = new JobModel(jobAttributes);
            //3. create a new lander model
            var landerModel = new LanderModel({
              id: jobAttributes.lander_id,
              name: jobAttributes.landerName,
              last_updated: jobAttributes.last_updated,
              deploy_status: "initializing"
            });
            //4. add jobmodel to lander model
            var activeJobs = landerModel.get("activeJobs");
            activeJobs.add(jobModel);
            Moonlander.trigger("job:start", jobModel);
            //5. trigger add lander model on the landers collection
            Moonlander.trigger("landers:list:addLander", landerModel);
          });


          duplicateLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(duplicateLanderLayout);
        
        }

      }
    });

    return Moonlander.LandersApp.Landers.DuplicateLander.Controller;
  });