define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/loading.tpl"
  ],
  function(Landerds, landersListLoadingTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.LandersApp.Landers.List.LoadingView;
  });