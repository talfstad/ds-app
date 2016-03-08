define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/list/deployed_domains/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView", function(DeployedDomainsCollectionView, Moonlander, Backbone, Marionette, $, _) {
      DeployedDomainsCollectionView.DeployedDomainRowView = Marionette.ItemView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

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
          var deployStatus = this.model.get("deploy_status");
          this.$el.removeClass("success alert warning");
          if (deployStatus === "deployed") {
            this.$el.addClass("success");
          } else if (deployStatus === "deploying" ||
            deployStatus === "undeploying") {
            this.$el.addClass("alert");
          } else if (deployStatus === "modified") {
            this.$el.addClass("warning");
          }

          this.trigger("updateParentLayout", this.model);

        },

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView.DeployedDomainRowView;
  });
