define(["app",
    "tpl!assets/js/apps/landerds/domains/undeploy_lander/templates/undeploy_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("LandersApp.Landers.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

      Undeploy.Layout = Marionette.LayoutView.extend({

        id: "undeploy-lander-modal",

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: UndeployLayoutTemplate,

        events: {
          "click .undeploy-confirm": "confirmedToUndeploy"
        },

        initialize: function() {
          this.landerModel = this.options.lander_model;
          this.domainModel = this.options.domain_model;
        },

        templateHelpers: function() {
          return {
            lander_name: this.landerModel.get("name"),
            domain_name: this.domainModel.get("domain")
          }
        },
        

        confirmedToUndeploy: function() {
          this.trigger("undeployLanderConfirm", this.model);      
        },

        onRender: function() {
          this.$el.modal('show');
        },

        onClose: function() {
          this.$el.modal('hide');
        }
        
      });

    });
    return Landerds.LandersApp.Landers.Undeploy.Layout;
  });