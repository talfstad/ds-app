define(["app",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaign_row_view",
    "assets/js/apps/landerds/landers/list/active_campaigns/views/active_campaign_empty_view"
  ],
  function(Landerds, ActiveCampaignRowView, EmptyView) {

    Landerds.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.ChildView = Marionette.CollectionView.extend({
        tagName: "table",
        className: "table",

        childEvents: {
          "gotoEditCampaign": "gotoEditCampaign"
        },

        gotoEditCampaign: function(childView) {
          var landerId = childView.model.get("lander_id");;
          var campaignId = childView.model.get("campaign_id");;

          //save this domain so on back button it reopens the domain
          Landerds.navigate("landers/show/" + landerId);
          //go to edit the lander
          Landerds.trigger("campaigns:list", campaignId);
        },

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
          model.set('viewIndex', parseInt(this.collection.indexOf(model)) + 1);
          model.set("landerName", this.collection.landerName);
        },

        childView: ActiveCampaignRowView,
        emptyView: EmptyView

      });
    });
    return Landerds.LandersApp.Landers.List.ActiveCampaigns.ChildView;
  });
