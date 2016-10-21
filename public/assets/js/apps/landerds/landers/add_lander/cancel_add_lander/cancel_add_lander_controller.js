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
            landerModel.set("addError", addError);
            landerModel.destroy();
          });

          addNewLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewLanderLayout);

        }

      }
    });

    return Landerds.LandersApp.Landers.AddLander.Cancel.Controller;
  });