define(["app",
    "assets/js/apps/landerds/landers/rip_new_lander/views/rip_new_lander_layout_view",
    "assets/js/apps/landerds/landers/dao/lander_model",
    "assets/js/jobs/jobs_model",
  ],
  function(Landerds, RipNewLanderLayoutView, LanderModel, JobModel) {
    Landerds.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Landerds, Backbone, Marionette, $, _) {

      RipNewLander.Controller = {

        showRipNewLanderModal: function() {

          var ripModel = new JobModel({
            action: "ripLander",
            deploy_status: "initializing:rip"
          });

          var ripNewLanderLayout = new RipNewLanderLayoutView({
            model: ripModel
          });

          ripNewLanderLayout.on("ripLanderConfirmed", function() {

            ripModel.set("alertLoading", true);


            ripModel.save({}, {
              success: function(registeredJobModel, responseObj) {

                var error = registeredJobModel.get("error");
                if (error) {
                  ripModel.set({
                    alertInvalidInputs: true,
                    alertLoading: false
                  });
                  registeredJobModel.unset("error");
                } else {
                  //has lander_id in it
                  ripNewLanderLayout.closeModal();
                  Landerds.trigger("landers:list:createLanderFromJobAddToCollection", registeredJobModel);
                }
              }
            });


            //create new job and save that with ripLander as action


            //save the job, callback has the landermodel id in it, we add that to the landermodel
            //add the job to landermodel then we add the lander model to the collection

            //pass the job model to the list controller, it will create the landermodel add it and attach the job




            // landerModel.save({}, {
            //   success: function(savedLanderModel) {
            //     var error = savedLanderModel.get("error");
            //     if (error) {

            //       landerModel.set({
            //         alertInvalidInputs: true,
            //         alertLoading: false
            //       });

            //       savedLanderModel.unset("error");
            //     } else {
            //       //add the new url endpoints

            //       // TODO this gets done on job switch deploy_status loads final data
            //       // var endpointsArr = savedLanderModel.get("url_endpoints_arr");
            //       // landerModel.get("urlEndpoints").add(endpointsArr);
            //       // landerModel.set({
            //       //   deployment_folder_name: savedLanderModel.get("s3_folder_name"),
            //       //   alertLoading: false
            //       // });

            //       ripNewLanderLayout.closeModal();

            //       Landerds.trigger("landers:list:addLander", landerModel);

            //     }
            //   }
            // });


          });


          ripNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.RipNewLander.Controller;
  });
