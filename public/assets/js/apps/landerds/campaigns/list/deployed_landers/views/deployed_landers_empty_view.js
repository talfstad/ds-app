define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_landers/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView", function(DeployedLandersCollectionView, Landerds, Backbone, Marionette, $, _) {
      DeployedLandersCollectionView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"


      });
    });
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView.EmptyView;
  });