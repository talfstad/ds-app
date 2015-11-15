define(["app",
    "tpl!/assets/js/apps/moonlander/landers/undeploy_campaign/templates/undeploy_layout.tpl"
  ],
  function(Moonlander, UndeployLayoutTemplate) {

    Moonlander.module("LandersApp.Landers.List.Campaign.Undeploy", function(Undeploy, Moonlander, Backbone, Marionette, $, _) {

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

        confirmedRemoveCampaignFromLander: function() {
          this.trigger("removeCampaignFromLander", this.model);      
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
    return Moonlander.LandersApp.Landers.List.Campaign.Undeploy.Layout;
  });