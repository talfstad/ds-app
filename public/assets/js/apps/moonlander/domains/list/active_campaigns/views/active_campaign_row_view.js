define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/active_campaigns/templates/active_campaign_row.tpl"
  ],
  function(Moonlander, ActiveCampaignRowTpl) {

    Moonlander.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Moonlander, Backbone, Marionette, $, _) {
      ActiveCampaigns.ActiveCampaignRowView = Marionette.ItemView.extend({

        template: ActiveCampaignRowTpl,
        tagName: "tbody",

        events: {
          "click .remove-campaign": "showUndeployDomainFromCampaignDialog"
        },

        showUndeployDomainFromCampaignDialog: function(e) {
          e.preventDefault();
          e.stopPropagation();

          Moonlander.trigger("domains:showUndeployDomainFromCampaignDialog", this.model);
        },

        modelEvents: {
          "change": "render"
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onBeforeRender: function() {
          //sort currentLanders asc by name
          var currentLanders = this.model.get("currentLanders")
          currentLanders.sort(function(a, b) {
            var keyA = a.name;
            var keyB = b.name;
            // Compare the 2 vals
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
        },

        onRender: function() {
          this.trigger("updateParentLayout", this.model);
        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.ActiveCampaignRowView;
  });
