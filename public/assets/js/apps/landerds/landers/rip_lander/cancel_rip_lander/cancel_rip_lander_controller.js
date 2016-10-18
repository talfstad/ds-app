define(["app",
    "assets/js/apps/landerds/landers/rip_lander/cancel_rip_lander/views/cancel_rip_lander_layout_view",
    "assets/js/jobs/jobs_model",
  ],
  function(Landerds, RipNewLanderLayoutView, JobModel) {
    Landerds.module("LandersApp.Landers.RipLander.Cancel", function(Cancel, Landerds, Backbone, Marionette, $, _) {

      Cancel.Controller = {

        showCancelRipLander: function(landerModel) {

          var ripNewLanderLayout = new RipNewLanderLayoutView({
            model: landerModel
          });

          ripNewLanderLayout.on("cancelRipConfirmed", function(ripError) {
            landerModel.set("ripError", ripError);
            landerModel.destroy();
          });

          ripNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(ripNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.RipLander.Cancel.Controller;
  });
