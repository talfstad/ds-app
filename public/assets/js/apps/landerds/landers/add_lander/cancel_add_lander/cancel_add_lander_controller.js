define(["app",
    "assets/js/apps/landerds/landers/add_lander/cancel_add_lander/views/cancel_add_lander_layout_view"
  ],
  function(Landerds, AddNewLanderLayoutView) {
    Landerds.module("LandersApp.Landers.AddLander.Cancel", function(Cancel, Landerds, Backbone, Marionette, $, _) {

      Cancel.Controller = {

        showCancelAddLander: function(landerModel) {

          var addNewLanderLayout = new AddNewLanderLayoutView({
            model: landerModel
          });

          addNewLanderLayout.on("cancelAddConfirmed", function(addError) {
            landerModel.set("addError", { save: addError });

            //instead of destroy it you want to get its add job and change deploy status
            //destroy happens on cancel
            // landerModel.destroy();
            landerModel.save({}, {
              success: function() {
                landerModel.unset("addError");
                landerModel.set("deploy_status", "deleting");
              }
            });
          });

          addNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.AddLander.Cancel.Controller;
  });