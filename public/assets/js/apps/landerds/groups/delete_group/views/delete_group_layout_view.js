define(["app",
    "tpl!assets/js/apps/landerds/groups/delete_group/templates/delete_group_layout.tpl"
  ],
  function(Landerds, RemoveGroupsLayout) {

    Landerds.module("GroupsApp.Groups.RemoveGroups", function(RemoveGroups, Landerds, Backbone, Marionette, $, _) {

      RemoveGroups.Layout = Marionette.LayoutView.extend({

        className: "modal fade",

        attributes: {
          tabindex: "-1",
          role: "dialog",
          "data-backdrop": "static"
        },

        template: RemoveGroupsLayout,

        events: {
          "click .remove-group-confirm": "confirmedRemoveGroups"
        },

        initialize: function() {
          
        },

        confirmedRemoveGroups: function(lander) {
          this.trigger("unattachGroupConfirm");
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
    return Landerds.GroupsApp.Groups.RemoveGroups.Layout;
  });
