define(["app",
    "assets/js/apps/landerds/landers/add_new_lander/views/add_new_lander_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/landers/dao/lander_model"
  ],
  function(Landerds, AddNewLanderLayoutView, JobModel, LanderModel) {
    Landerds.module("LandersApp.Landers.AddNewLander", function(AddNewLander, Landerds, Backbone, Marionette, $, _) {

      AddNewLander.Controller = {

        showAddNewLanderModal: function() {

          //make new lander model for it
          var jobModel = new JobModel({
            action: "addNewLander"
          });

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: jobModel
          });

          addNewLanderLayout.on("fileUploadComplete", function(data) {
            var jobAttributes = data.response;
            //// server returns job id, lander id
            //2. create new jobmodel with jobid and action and lander id
            var jobModel = new JobModel(jobAttributes);
            //3. create a new lander model
            var landerModel = new LanderModel({
              id: jobAttributes.lander_id,
              name: jobAttributes.landerName,
              created_on: jobAttributes.created_on,
              deploy_status: "initializing"
            });
            //4. add jobmodel to lander model
            var activeJobs = landerModel.get("activeJobs");
            activeJobs.add(jobModel);
            Landerds.trigger("job:start", jobModel);

            //5. trigger add lander model on the landers collection
            Landerds.trigger("landers:list:addLander", landerModel);

            addNewLanderLayout.onClose();
          });


          addNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.AddNewLander.Controller;
  });
