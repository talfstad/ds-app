define(["app",
    "tpl!assets/js/apps/landerds/domains/list/active_campaigns/templates/active_campaign_row.tpl",
    "assets/js/apps/landerds/base_classes/deployed_rows/views/row_base_view"
  ],
  function(Landerds, ActiveCampaignRowTpl, RowBaseView) {

    Landerds.module("DomainsApp.Domains.List.ActiveCampaigns", function(ActiveCampaigns, Landerds, Backbone, Marionette, $, _) {
      ActiveCampaigns.ActiveCampaignRowView = RowBaseView.extend({

        template: ActiveCampaignRowTpl,
        tagName: "tr",

        className: "campaign-name-row",

        events: {
          "click .remove-campaign": "showUndeployDomainFromCampaignDialog",
          "click .goto-edit-campaign": "gotoEditCampaign",
        },

        modelEvents: {
          "change:deploy_status": "render",
          "change:viewIndex": "updateViewIndex"
        },

        gotoEditCampaign: function(e) {
          if (e) e.preventDefault();
          this.trigger("gotoEditCampaign");
        },

        showUndeployDomainFromCampaignDialog: function(e) {
          e.preventDefault();
          this.model.trigger("showUndeployDomainFromCampaignDialog", this.model);
        },

        onBeforeRender: function() {

        },

        onRender: function() {
          RowBaseView.prototype.onRender.apply(this);
        }

      });
    });
    return Landerds.DomainsApp.Domains.List.ActiveCampaigns.ActiveCampaignRowView;
  });
