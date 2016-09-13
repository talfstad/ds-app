define(["app",
    "tpl!assets/js/apps/landerds/campaigns/undeploy_lander/templates/undeploy_lander_layout.tpl"
  ],
  function(Landerds, RemoveLanderLayout) {

    Landerds.module("CampaignsApp.Campaigns.RemoveLander", function(RemoveLander, Landerds, Backbone, Marionette, $, _) {

      RemoveLander.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveLanderLayout,

        events: {
          "click .remove-lander-confirm": "confirmedRemoveLander"
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

        confirmedRemoveLander: function(lander) {
          this.trigger("removeLanderFromCampaignConfirm");
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
    return Landerds.CampaignsApp.Campaigns.RemoveLander.Layout;
  });
