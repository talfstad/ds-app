define(["app",
    "assets/js/apps/landerds/landers/rip_lander/views/rip_lander_layout_view",
    "assets/js/apps/landerds/landers/rip_lander/cancel_rip_lander/cancel_rip_lander_controller",
    "assets/js/apps/landerds/jobs/jobs_model",
  ],
  function(Landerds, RipNewLanderLayoutView, CancelRipLanderController, JobModel) {
    Landerds.module("LandersApp.Landers.RipNewLander", function(RipNewLander, Landerds, Backbone, Marionette, $, _) {

      RipNewLander.Controller = {

        showCancelRipLander: function(model) {
          CancelRipLanderController.showCancelRipLander(model);
        },

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
          });

          ripNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.RipNewLander.Controller;
  });
