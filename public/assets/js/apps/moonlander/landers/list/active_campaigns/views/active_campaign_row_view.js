define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/active_campaigns/templates/active_campaign_row.tpl"
  ],
  function(Moonlander, ActiveCampaignRowTpl) {

    Moonlander.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.ActiveCampaignRowView = Marionette.ItemView.extend({

        template: ActiveCampaignRowTpl,
        tagName: "tr",
        className: "info pb13",

        events: {
          "click .remove-campaign": "showRemoveLanderFromCampaignDialog"
        },

        showRemoveLanderFromCampaignDialog: function(e){
          e.preventDefault();
          e.stopPropagation();

          Moonlander.trigger("landers:showRemoveLanderFromCampaignDialog", this.model);
        },

        modelEvents: {
          "change": "render"
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", 'hi');
        },

        onRender: function() {
          this.trigger("updateParentLayout", this.model);
        }

      });
    });
    return Moonlander.LandersApp.Landers.List.ActiveCampaigns.ActiveCampaignRowView;
  });
