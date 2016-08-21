define(["app",
    "tpl!assets/js/apps/landerds/landers/undeploy_domain/templates/undeploy_domain_layout.tpl"
  ],
  function(Landerds, RemoveDomainLayoutTpl) {

    Landerds.module("LandersApp.Landers.List.Lander.RemoveDomain", function(RemoveDomain, Landerds, Backbone, Marionette, $, _) {

      RemoveDomain.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveDomainLayoutTpl,

        events: {
          "click .remove-domain-confirm": "confirmedRemoveDomain"
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

        confirmedRemoveDomain: function(domain) {
          this.trigger("removeDomainConfirm");
        },

        onRender: function() {
          this.$el.modal('show');
        },

        onClose: function() {
          this.$el.modal('hide');
        }

      });

    });
    return Landerds.LandersApp.Landers.List.Lander.RemoveDomain.Layout;
  });