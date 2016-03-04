define(["app",
    "/assets/js/apps/moonlander/campaigns/list/deployed_landers/views/deployed_lander_row_view.js",
    "/assets/js/apps/moonlander/campaigns/list/deployed_landers/views/deployed_landers_empty_view.js"
  ],
  function(Moonlander, DeployedDomainRowView, EmptyView) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView", function(RowView, Moonlander, Backbone, Marionette, $, _) {
      RowView.DeployedLandersCollectionView = Marionette.CollectionView.extend({
        tagName: "tbody",
        childView: DeployedDomainRowView,
        emptyView: EmptyView,


        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(deployedLanderModel, idx) {
            deployedLanderModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set('domain', this.collection.domain);
          model.set('domain_id', this.collection.domain_id);

          //return options ONLY used by our empty view.
          return {
            isInitializing: this.collection.isInitializing || false
          };
        },

        onRender: function() {



        }

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedLandersCollectionView;
  });
