define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/loading.tpl"
  ],
  function(Moonlander, landersListLoadingTpl) {

    Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.List.LoadingView;
  });
