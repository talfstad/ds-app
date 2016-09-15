define(["app",
    "tpl!assets/js/apps/landerds/groups/right_sidebar/templates/sidebar_groups.tpl",
    "bootstrap"
  ],
  function(Landerds, sidebarLanders) {

    Landerds.module("GroupsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.View = Marionette.LayoutView.extend({

        template: sidebarLanders,
        tagName: "aside",
        id: "sidebar_right",
        className: "nano affix",

        modelEvents: {
          "change:alertBadGroupsName": "alertBadGroupsName"
        },

        events: {
          "click .remove-group-button": "showRemoveGroupsModal",
          "click .update-group-name-button": "updateGroupsName"
        },

        alertBadGroupsName: function() {
          if (this.model.get("alertBadGroupsName")) {
            this.$el.find(".group-name-alert").show();
          } else {
            this.$el.find(".group-name-alert").hide();
          }
        },

        updateGroupsName: function() {
          var me = this;

          var name = this.$el.find(".group-name-edit").val();

          //can't be empty
          if (name != "") {
            
            this.model.set({
              "alertBadGroupsName": false,
              "name": name
            });

            this.trigger("updateGroupsName");
          } else {
            this.model.set("alertBadGroupsName", true);
          }
        },

        showRemoveGroupsModal: function() {
          Landerds.trigger("groups:showRemoveGroups", this.model);
        },

        setUpdateGroupsNameButtonState: function(enable) {
          if (enable) {
            this.$el.find(".update-group-name-button").removeClass("disabled");
          } else {
            this.$el.find(".update-group-name-button").addClass("disabled");
          }
        },

        onRender: function() {
          var me = this;
          this.$el.find(".group-name-edit").keyup(function() {
            me.setUpdateGroupsNameButtonState(true);
          });
        },

        onDomRefresh: function() {
          var me = this;
          $("body").removeClass("external-page");

          $(".close-right-sidebar").click(function(e) {
            me.closeSidebar();
            $(".collapse").collapse('hide');
          });
        },

        openSidebar: function(model) {
          var Body = $("body");
          if (!Body.hasClass('sb-r-o')) {
            Body.addClass('sb-r-o').removeClass("sb-r-c");
          }
        },

        closeSidebar: function() {
          var Body = $("body");
          // If sidebar is set to Horizontal we return
          if ($('body.sb-top').length) {
            return;
          }
          if (!Body.hasClass('sb-r-c')) {
            Body.addClass('sb-r-c').removeClass("sb-r-o");
          }
        }

      });


    });
    return Landerds.GroupsApp.RightSidebar.View;
  });
