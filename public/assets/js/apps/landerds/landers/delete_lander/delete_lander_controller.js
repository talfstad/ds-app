define(["app",
    "assets/js/apps/landerds/landers/delete_lander/views/loading_view",
    "assets/js/apps/landerds/landers/delete_lander/views/delete_lander_layout_view",
  ],
  function(Landerds, LoadingView, DeleteLanderLayoutView) {
    Landerds.module("LandersApp.Landers.DeleteLander", function(DeleteLander, Landerds, Backbone, Marionette, $, _) {

      DeleteLander.Controller = {

        showDeleteLanderModal: function(model) {

          var deleteLanderLayout = new DeleteLanderLayoutView({
            model: model
          });

          deleteLanderLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deleteLanderLayout);
        }



      }
    });

    return Landerds.LandersApp.Landers.DeleteLander.Controller;
  });
