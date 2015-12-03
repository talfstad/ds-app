define(["app",
    "tpl!/assets/js/apps/moonlander/landers/add_to_campaign/templates/loading.tpl"
  ],
  function(Moonlander, DeleteLanderLoadingTpl) {

    Moonlander.module("LandersApp.DeleteLander", function(DeleteLander, Moonlander, Backbone, Marionette, $, _) {
      DeleteLander.LoadingView = Marionette.ItemView.extend({

        template: DeleteLanderLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.DeleteLander.LoadingView;
  });