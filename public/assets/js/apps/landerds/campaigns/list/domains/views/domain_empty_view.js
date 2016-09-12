define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/domains/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.Domain", function(Domain, Landerds, Backbone, Marionette, $, _) {
      Domain.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        className: "dark",
        tagName: "tr"

      });
    });
    return Landerds.CampaignsApp.Campaigns.List.Domain.EmptyView;
  });