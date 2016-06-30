define(["app",
    "tpl!assets/js/apps/landerds/campaigns/remove_campaign/templates/remove_campaign_layout.tpl"
  ],
  function(Landerds, RemoveCampaignLayout) {

    Landerds.module("CampaignsApp.Campaigns.RemoveCampaign", function(RemoveCampaign, Landerds, Backbone, Marionette, $, _) {

      RemoveCampaign.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveCampaignLayout,

        events: {
          "click .remove-campaign-confirm": "confirmedRemoveCampaign"
        },

        initialize: function() {
          
        },

        confirmedRemoveCampaign: function(lander) {
          this.trigger("removeCampaignConfirm");
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
    return Landerds.CampaignsApp.Campaigns.RemoveCampaign.Layout;
  });
