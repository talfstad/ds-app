define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/templates/topbar.tpl"
  ],
 function(Moonlander, topbarTpl) {

  Moonlander.module("CampaignsApp.Campaigns.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Moonlander.CampaignsApp.Campaigns.List.TopbarView;
});