define(["app",
    "tpl!assets/js/apps/landerds/domains/list/active_campaigns/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"

      });
    });
    return Landerds.DomainsApp.Domains.List.ActiveCampaigns.EmptyView;
  });
