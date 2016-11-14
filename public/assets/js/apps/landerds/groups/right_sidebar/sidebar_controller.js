define(["app",
    "assets/js/apps/landerds/groups/right_sidebar/sidebar_layout_view",
    "assets/js/apps/landerds/groups/dao/sidebar_model",
  ],
  function(Landerds, SidebarLayoutView, SidebarModel, NameserversView) {
    Landerds.module("GroupsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        groupModel: null,

        openSidebar: function(model) {
          var me = this;

          this.groupModel = model;

          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          this.sidebarView.on("updateGroupsName", function() {
            model.save({}, {
              success: function() {
                model.trigger("resortAndExpandModelView");
              },
              error: function() {

              }
            });
          });

          //show it
          Landerds.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);

          //open
          setTimeout(this.sidebarView.openSidebar, 20);
        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Landerds.GroupsApp.RightSidebar.Controller;
  });
