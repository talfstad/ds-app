define(["app",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaign_row_view",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaign_empty_view"
  ],
  function(Landerds, ActiveCampaignRowView, EmptyView) {

    Landerds.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.ChildView = Marionette.CollectionView.extend({
        tagName: "table",
        className: "table",

        onAddChild: function(childView) {
          this.reIndex();
        },

        onRemoveChild: function(childView) {
          this.reIndex();
        },

        reIndex: function() {
          this.collection.each(function(activeCampaignModel, idx) {
            activeCampaignModel.set("viewIndex", idx + 1);
          });
        },

        //pass the deployed list its rendered index for # column
        childViewOptions: function(model) {
          model.set('viewIndex', parseInt(this.collection.indexOf(model))+1);
          model.set("landerName", this.collection.landerName);
        },

        childView: ActiveCampaignRowView,
        emptyView: EmptyView
                
      });
    });
    return Landerds.LandersApp.Landers.List.ActiveCampaigns.ChildView;
  });
