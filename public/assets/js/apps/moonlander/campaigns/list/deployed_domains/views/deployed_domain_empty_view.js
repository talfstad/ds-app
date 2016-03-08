define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/list/deployed_domains/templates/empty.tpl"
  ],
  function(Moonlander, EmptyTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView", function(DeployedDomainsCollectionView, Moonlander, Backbone, Marionette, $, _) {
      DeployedDomainsCollectionView.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        className: "dark",
        tagName: "tr"

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView.EmptyView;
  });

