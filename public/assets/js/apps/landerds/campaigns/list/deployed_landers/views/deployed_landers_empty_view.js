define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_landers/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"
      });
    });
    return Landerds.CampaignsApp.Campaigns.List.Deployed.EmptyView;
  });