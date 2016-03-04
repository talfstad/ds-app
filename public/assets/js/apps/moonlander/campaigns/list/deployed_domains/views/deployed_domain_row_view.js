define(["app",
    "tpl!/assets/js/apps/moonlander/campaigns/list/deployed_domains/templates/deployed_domain_row.tpl"
  ],
  function(Moonlander, DeployedDomainRowTpl) {

    Moonlander.module("CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView", function(DeployedDomainsCollectionView, Moonlander, Backbone, Marionette, $, _) {
      DeployedDomainsCollectionView.DeployedDomainRowView = Marionette.ItemView.extend({

        template: DeployedDomainRowTpl,
        tagName: "tr",
        className: "dark",

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
         
        },

        onRender: function() {
          this.trigger("updateParentLayout", this.model);
        }

      });
    });
    return Moonlander.CampaignsApp.Campaigns.List.CollectionView.RowView.DeployedDomainsCollectionView.DeployedDomainRowView;
  });
