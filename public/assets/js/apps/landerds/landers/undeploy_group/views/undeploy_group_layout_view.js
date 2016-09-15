define(["app",
    "tpl!assets/js/apps/landerds/landers/undeploy_group/templates/undeploy_group_layout.tpl"
  ],
  function(Landerds, UndeployLayoutTemplate) {

    Landerds.module("LandersApp.Landers.List.Groups.Undeploy", function(Undeploy, Landerds, Backbone, Marionette, $, _) {

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
          this.landerModel = this.options.lander_model;
        },

        templateHelpers: function() {
          return {
            group_name: this.groupModel.get("name"),
            lander_name: this.landerModel.get("name")
          }
        },

        confirmedRemoveGroupsFromLander: function() {
          this.trigger("removeGroupsFromLander", this.model);      
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
    return Landerds.LandersApp.Landers.List.Groups.Undeploy.Layout;
  });