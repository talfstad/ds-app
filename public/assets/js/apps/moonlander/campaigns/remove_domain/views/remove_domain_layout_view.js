define(["app",
    "tpl!assets/js/apps/moonlander/campaigns/remove_domain/templates/remove_domain_layout.tpl"
  ],
  function(Moonlander, RemoveDomainLayout) {

    Moonlander.module("CampaignsApp.Campaigns.RemoveDomain", function(RemoveDomain, Moonlander, Backbone, Marionette, $, _) {

      RemoveDomain.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveDomainLayout,

        events: {
          "click .remove-domain-confirm": "confirmedRemoveDomain"
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

        confirmedRemoveDomain: function(domain) {
          this.trigger("removeDomainFromCampaignConfirm");
        },

        onRender: function() {
          var me = this;

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e) {


          });

          this.$el.on('shown.bs.modal', function(e) {


          });

          this.$el.modal('show');

        },

        onClose: function() {
          this.$el.modal('hide');
        },

        onDomRefresh: function() {


        }
      });

    });
    return Moonlander.CampaignsApp.Campaigns.RemoveDomain.Layout;
  });
