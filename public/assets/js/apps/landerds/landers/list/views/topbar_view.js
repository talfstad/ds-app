define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/topbar.tpl"
  ],
 function(Landerds, topbarTpl) {

  Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Landerds.LandersApp.Landers.List.TopbarView;
});