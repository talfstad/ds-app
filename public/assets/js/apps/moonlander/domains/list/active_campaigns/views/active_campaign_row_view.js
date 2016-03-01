define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/active_campaigns/templates/active_campaign_row.tpl"
  ],
  function(Moonlander, ActiveCampaignRowTpl) {

    Moonlander.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.ActiveCampaignRowView = Marionette.ItemView.extend({

        template: ActiveCampaignRowTpl,
        tagName: "tbody",

        events: {
          "click .remove-campaign": "showRemoveLanderFromCampaignDialog"
        },

        showRemoveLanderFromCampaignDialog: function(e){
          e.preventDefault();
          e.stopPropagation();

          Moonlander.trigger("domains:showRemoveLanderFromCampaignDialog", this.model);
        },

        modelEvents: {
          "change": "render"
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onRender: function() {
          this.trigger("updateParentLayout", this.model);
        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.ActiveCampaignRowView;
  });
