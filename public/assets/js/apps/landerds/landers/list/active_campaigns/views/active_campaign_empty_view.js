define(["app",
    "tpl!assets/js/apps/landerds/landers/list/active_campaigns/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tbody",
        className: "dark"

      });
    });
    return Landerds.LandersApp.Landers.List.ActiveCampaigns.EmptyView;
  });
