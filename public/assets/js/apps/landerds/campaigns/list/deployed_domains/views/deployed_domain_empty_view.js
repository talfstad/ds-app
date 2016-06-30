define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_domains/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView", function(DeployedDomainsCollectionView, Landerds, Backbone, Marionette, $, _) {
      DeployedDomainsCollectionView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        className: "dark",
        tagName: "tr"

      });
    });
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView.EmptyView;
  });

