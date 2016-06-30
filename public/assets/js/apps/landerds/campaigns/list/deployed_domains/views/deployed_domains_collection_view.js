define(["app",
    "assets/js/apps/landerds/campaigns/list/deployed_domains/views/deployed_domain_row_view",
    "assets/js/apps/landerds/campaigns/list/deployed_domains/views/deployed_domain_empty_view"
  ],
  function(Landerds, DeployedDomainRowView, EmptyView) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView.RowView", function(RowView, Landerds, Backbone, Marionette, $, _) {
      RowView.DeployedDomainsCollectionView = Marionette.CollectionView.extend({
        tagName: "tbody",

        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(deployedDomainModel, idx) {
            deployedDomainModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          // model.set("name", this.collection.name);
        },

        childView: DeployedDomainRowView,
        emptyView: EmptyView
                
      });
    });
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView;
  });
