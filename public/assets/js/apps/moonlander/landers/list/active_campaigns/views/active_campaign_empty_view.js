define(["app",
    "tpl!assets/js/apps/moonlander/landers/list/active_campaigns/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tbody",
        className: "dark"

      });
    });
    return Moonlander.LandersApp.Landers.List.ActiveCampaigns.EmptyView;
  });
