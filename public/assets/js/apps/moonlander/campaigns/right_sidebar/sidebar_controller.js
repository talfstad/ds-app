define(["app",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/sidebar_layout_view.js",
    "/assets/js/apps/moonlander/campaigns/dao/sidebar_model.js",
    "/assets/js/apps/moonlander/campaigns/right_sidebar/nameservers_view.js" 
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

        //save even if not modified because it might not be deployed
        //in which case we would want to save it anyway
        updateToModifiedAndSave: function() {

          var deployedLocationCollection = this.campaignModel.get("deployedLocations");

          //1. set modified if it is deployed
          if (deployedLocationCollection.length > 0) {
            this.campaignModel.set("modified", true);
          }
          //2. save it no matter what
          this.campaignModel.save({}, {
            success: function() {
              deployedLocationCollection.each(function(location) {
                var deployStatus = location.get("deploy_status");
                if (deployStatus != "undeploying" && deployStatus != "deploying") {
                  location.set("deploy_status", "modified");
                } else {
                  location.set("shouldSetModifiedWhenJobsFinish", true);
                }
              });
            }
          });

        },

        //whenever sidebar is open it has the real lander model as its model not a stupid sidebar model
        //sidebar model is just a mock thing to make loading work
        openSidebar: function(model) {
          var me = this;

          this.campaignModel = model;

          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          // var nameserversView = new NameserversView({
          //   model: model
          // });

          //when optimizations modified save them and set correct deploy status
          //when changing deploy status must start with the deployed locations status
          //it will propogate up to the lander model
          // nameserversView.on("modified", function() {

          //   me.updateToModifiedAndSave();


          // });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);

          //optimization region view
          // Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(nameserversView);

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
