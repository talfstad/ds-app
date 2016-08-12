define(["app",
    "tpl!assets/js/apps/landerds/landers/list/active_campaigns/templates/active_campaign_row.tpl"
  ],
  function(Landerds, ActiveCampaignRowTpl) {

    Landerds.module("LandersApp.Landers.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.ActiveCampaignRowView = Marionette.ItemView.extend({

        template: ActiveCampaignRowTpl,
        tagName: "tbody",

        events: {
          "click .remove-campaign": "showUndeployDomainFromCampaignDialog",
          "click .goto-edit-campaign": "gotoEditCampaign",
        },

        gotoEditCampaign: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditCampaign");
        },

        showUndeployDomainFromCampaignDialog: function(e) {
          e.preventDefault();

          this.model.trigger("showUndeployDomainFromCampaignDialog", this.model);
        },

        modelEvents: {
          "change": "render"
        },

        onDestroy: function() {
          this.trigger("updateParentLayout", this.model);
        },

        onBeforeRender: function() {
          //sort deployedDomains asc by name
          var deployedDomains = this.model.get("deployedDomains");
          deployedDomains.sort(function(a, b) {
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
    return Landerds.LandersApp.Landers.List.ActiveCampaigns.ActiveCampaignRowView;
  });
