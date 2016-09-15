define(["app",
    "tpl!assets/js/apps/landerds/domains/undeploy_group/templates/undeploy_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("DomainsApp.Domains.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

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
          "click .undeploy-confirm": "confirmedRemoveGroupsFromLander"
        },

        initialize: function() {
          this.groupModel = this.options.group_model;
          this.domainModel = this.options.domain_model;
        },

        templateHelpers: function() {
          return {
            group_name: this.groupModel.get("name"),
            domain_name: this.domainModel.get("domain")
          }
        },

        confirmedRemoveGroupsFromLander: function() {
          this.trigger("removeGroupsFromDomain", this.model);      
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
    return Landerds.DomainsApp.Domains.List.Groups.Undeploy.Layout;
  });