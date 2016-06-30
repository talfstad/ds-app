define(["app",
    "tpl!assets/js/apps/landerds/domains/undeploy_campaign/templates/undeploy_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("DomainsApp.Domains.UndeployCampaign", function(UndeployCampaign, Landerds, Backbone, Marionette, $, _) {

      UndeployCampaign.Layout = Marionette.LayoutView.extend({

        id: "undeploy-lander-modal",

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

          this.$el.off('show.bs.modal');
          this.$el.off('shown.bs.modal');

          this.$el.on('show.bs.modal', function(e){
          
           
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
    return Landerds.DomainsApp.Domains.UndeployCampaign.Layout;
  });