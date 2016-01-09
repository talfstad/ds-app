define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/topbar.tpl"
  ],
 function(Moonlander, topbarTpl) {

  Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Moonlander.DomainsApp.Domains.List.TopbarView;
});