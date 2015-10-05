define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/topbar.tpl"
  ],
 function(Moonlander, topbarTpl) {

  Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Moonlander.LandersApp.Landers.List.TopbarView;
});