define(["app",
    "tpl!assets/js/apps/landerds/campaigns/list/deployed_domains/templates/deployed_domain_row.tpl"
  ],
  function(Landerds, DeployedDomainRowTpl) {

    Landerds.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView", function(DeployedDomainsCollectionView, Landerds, Backbone, Marionette, $, _) {
      DeployedDomainsCollectionView.DeployedDomainRowView = Marionette.ItemView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",

        events: {
          "click .remove-domain": "showRemoveDomain",
          "click .goto-edit-domain": "gotoEditDomain",
        },

        modelEvents: {
          "change": "render"
        },

        gotoEditDomain: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditDomain");
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
          }

          if (this.model.get("modified")) {
            this.$el.removeClass("success alert warning");
            this.$el.addClass("warning");
          }

          this.trigger("updateParentLayout", this.model);

        },

        showRemoveDomain: function(e) {
          e.preventDefault();
          e.stopPropagation();

          this.model.trigger("showRemoveDomain", this.model);
        }

      });
    });
    return Landerds.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView.DeployedDomainRowView;
  });
