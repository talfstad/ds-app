define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/topbar.tpl"
  ],
 function(Landerds, topbarTpl) {

  Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Landerds.DomainsApp.Domains.List.TopbarView;
});