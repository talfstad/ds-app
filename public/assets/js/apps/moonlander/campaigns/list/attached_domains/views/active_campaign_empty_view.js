define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/active_campaigns/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tbody"
        
      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.ActiveCampaigns.EmptyView;
  });
