define(["app",
    "tpl!assets/js/apps/landerds/groups/undeploy_lander/templates/undeploy_lander_layout.tpl"
  ],
  function(Landerds, RemoveLanderLayout) {

    Landerds.module("GroupsApp.Groups.RemoveLander", function(RemoveLander, Landerds, Backbone, Marionette, $, _) {

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
          this.groupModel = this.options.group_model;
          this.landerModel = this.options.lander_model;
        },

        templateHelpers: function() {
          return {
            group_name: this.groupModel.get("name"),
            lander_name: this.landerModel.get("name")
          }
        },

        confirmedRemoveLander: function(lander) {
          this.trigger("removeLanderFromGroupsConfirm");
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
    return Landerds.GroupsApp.Groups.RemoveLander.Layout;
  });
