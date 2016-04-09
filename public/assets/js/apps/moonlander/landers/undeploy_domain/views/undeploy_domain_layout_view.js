define(["app",
    "tpl!assets/js/apps/moonlander/landers/undeploy_domain/templates/undeploy_domain_layout.tpl"
  ],
  function(Moonlander, RemoveDomainLayoutTpl) {

    Moonlander.module("LandersApp.Landers.List.Lander.RemoveDomain", function(RemoveDomain, Moonlander, Backbone, Marionette, $, _) {

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
    return Moonlander.LandersApp.Landers.List.Lander.RemoveDomain.Layout;
  });