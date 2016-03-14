define(["app",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/sidebar_layout_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/sidebar_model.js",
  ],
  function(Moonlander, SidebarLayoutView, SidebarModel, NameserversView) {
    Moonlander.module("CampaignsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        campaignModel: null,

        //needed to make animations correct sets width etc. for initial opening
        loadCampaignsSideMenu: function() {
          this.campaignModel = new SidebarModel();

          this.sidebarView = new SidebarLayoutView({
            model: this.campaignModel
          });

          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
        },

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
                if (model.collection.original) {
                  model.collection.original.trigger("resortAndExpandModelView", model);
                } else {
                  model.collection.trigger("resortAndExpandModelView", model);
                }
              },
              error: function() {

              }
            });
          });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);

          //open
          setTimeout(this.sidebarView.openSidebar, 20);
        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Moonlander.CampaignsApp.RightSidebar.Controller;
  });
