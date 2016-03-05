define(["app",
    "/assets/js/apps/moonlander/campaigns/list/deployed_domains/views/deployed_domain_row_view.js",
    "/assets/js/apps/moonlander/campaigns/list/deployed_domains/views/deployed_domain_empty_view.js"
  ],
  function(Moonlander, DeployedDomainRowView, EmptyView) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView", function(RowView, Moonlander, Backbone, Marionette, $, _) {
      RowView.DeployedDomainsCollectionView = Marionette.CollectionView.extend({
        tagName: "tbody",

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set("name", this.collection.name);
        },

        childView: DeployedDomainRowView,
        emptyView: EmptyView
                
      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView;
  });
