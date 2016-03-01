define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/active_campaigns/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tbody"
        
      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.EmptyView;
  });
