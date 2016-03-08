define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/list/deployed_landers/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView", function(DeployedLandersCollectionView, Moonlander, Backbone, Marionette, $, _) {
      DeployedLandersCollectionView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"


      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView.EmptyView;
  });