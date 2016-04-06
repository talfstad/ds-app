define(["app",
    "tpl!assets/js/apps/moonlander/domains/list/active_campaigns/templates/active_campaign_row.tpl"
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
          //sort deployedLanders asc by name
          var deployedLanders = this.model.get("deployedLanders");
          deployedLanders.sort(function(a, b) {
            var keyA = a.name;
            var keyB = b.name;
            // Compare the 2 vals
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });

          var deployStatus = this.model.get("deploy_status");
          if (deployStatus === "deployed") {
            this.model.set("deploy_status_gui", "");
          } else if (deployStatus === "deploying") {
            this.model.set("deploy_status_gui", "<strong>DEPLOYING</strong>");
          } else if (deployStatus === "undeploying") {
            this.model.set("deploy_status_gui", "<strong>UNDEPLOYING</strong>");
          }
      
        },

        onRender: function() {
          var campaignNameRow = this.$el.find(".campaign-name-row");

          var deployStatus = this.model.get("deploy_status");
          campaignNameRow.removeClass("success alert dark");
          if (deployStatus === "deployed") {
            campaignNameRow.addClass("dark");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            campaignNameRow.addClass("alert");
          }

          this.trigger("updateParentLayout", this.model);
        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.ActiveCampaigns.ActiveCampaignRowView;
  });
