define(["app",
    "tpl!assets/js/apps/landerds/landers/add_to_group/templates/loading.tpl"
  ],
  function(Landerds, DeleteLanderLoadingTpl) {

    Landerds.module("LandersApp.DeleteLander", function(DeleteLander, Landerds, Backbone, Marionette, $, _) {
      DeleteLander.LoadingView = Marionette.ItemView.extend({

        template: DeleteLanderLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.LandersApp.DeleteLander.LoadingView;
  });