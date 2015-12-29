define(["app",
    "/assets/js/apps/moonlander/landers/add_new_lander/views/add_new_lander_layout_view.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/landers/dao/lander_model.js"
  ],
  function(Moonlander, AddNewLanderLayoutView, JobModel, LanderModel) {
    Moonlander.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Moonlander, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLanderModal: function() {

          //make new lander model for it
          var jobModel = new JobModel({
            action: "addNewLander"
          });

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: jobModel
          });

          addNewLanderLayout.on("fileUploadComplete", function(data){
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


          addNewLanderLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addNewLanderLayout);
        
        }

      }
    });

    return Moonlander.LandersApp.Landers.AddNewLander.Controller;
  });