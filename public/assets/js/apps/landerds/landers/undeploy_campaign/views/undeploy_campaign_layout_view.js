define(["app",
    "tpl!assets/js/apps/landerds/landers/undeploy_campaign/templates/undeploy_campaign_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("LandersApp.Landers.List.Campaign.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Layout = Marionette.LayoutView.extend({

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
          this.landerModel = this.options.lander_model;
        },

        templateHelpers: function() {
          return {
            campaign_name: this.campaignModel.get("name"),
            lander_name: this.landerModel.get("name")
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
    return Landerds.LandersApp.Landers.List.Campaign.Undeploy.Layout;
  });