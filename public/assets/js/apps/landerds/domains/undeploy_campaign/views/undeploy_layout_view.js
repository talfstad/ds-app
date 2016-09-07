define(["app",
    "tpl!assets/js/apps/landerds/domains/undeploy_campaign/templates/undeploy_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("DomainsApp.Domains.List.Campaign.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: UndeployLayoutTemplate,

        regions: {

        },

        events: {
          "click .undeploy-confirm": "confirmedRemoveCampaignFromLander"
        },

        initialize: function() {
          this.campaignModel = this.options.campaign_model;
          this.domainModel = this.options.domain_model;
        },

        templateHelpers: function() {
          return {
            campaign_name: this.campaignModel.get("name"),
            domain_name: this.domainModel.get("domain")
          }
        },

        confirmedRemoveCampaignFromLander: function() {
          this.trigger("removeCampaignFromDomain", this.model);      
        },

        onRender: function() {
          var me = this;
          this.$el.modal('show');
        },

        onClose: function() {
          this.$el.modal('hide');
        }
      
      });

    });
    return Landerds.DomainsApp.Domains.List.Campaign.Undeploy.Layout;
  });