define(["app",
    "assets/js/apps/landerds/campaigns/right_sidebar/sidebar_layout_view",
    "assets/js/apps/landerds/campaigns/dao/sidebar_model",
  ],
  function(Landerds, SidebarLayoutView, SidebarModel, NameserversView) {
    Landerds.module("CampaignsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        campaignModel: null,

        //whenever sidebar is open it has the real lander model as its model not a stupid sidebar model
        //sidebar model is just a mock thing to make loading work
        openSidebar: function(model) {
          var me = this;

          this.campaignModel = model;

          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          this.sidebarView.on("updateCampaignName", function() {
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

    return Landerds.CampaignsApp.RightSidebar.Controller;
  });
