define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/templates/topbar.tpl"
  ],
 function(Landerds, topbarTpl) {

  Landerds.module("CampaignsApp.Campaigns.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Landerds.CampaignsApp.Campaigns.List.TopbarView;
});