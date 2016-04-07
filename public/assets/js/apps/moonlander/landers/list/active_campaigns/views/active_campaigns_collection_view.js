define(["app",
    "/assets/js/apps/moonlander/landers/list/active_campaigns/views/active_campaign_row_view.js",
    "/assets/js/apps/moonlander/landers/list/active_campaigns/views/active_campaign_empty_view.js"
  ],
  function(Moonlander, ActiveCampaignRowView, EmptyView) {

    Moonlander.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.LandersApp.Landers.List.ActiveCampaigns.ChildView;
  });
