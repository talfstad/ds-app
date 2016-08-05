define(["app",
    "assets/js/apps/landerds/domains/right_sidebar/sidebar_layout_view",
    "assets/js/apps/landerds/domains/dao/sidebar_model",
    "assets/js/apps/landerds/domains/right_sidebar/nameservers_view"
  ],
  function(Landerds, SidebarLayoutView, SidebarModel, NameserversView) {
    Landerds.module("DomainsApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        domainModel: null,

        //needed to make animations correct sets width etc. for initial opening
        loadDomainsSideMenu: function() {
          this.domainModel = new SidebarModel();

          this.sidebarView = new SidebarLayoutView({
            model: this.domainModel
          });

          Landerds.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
        },

        //save even if not modified because it might not be deployed
        //in which case we would want to save it anyway
        updateToModified: function() {

          var deployedLanderCollection = this.domainModel.get("deployedLanders");

          //1. set modified if it is deployed
          if (deployedLanderCollection.length > 0) {
            this.domainModel.set("modified", true);
          }
          //2. save it no matter what
          this.domainModel.save({}, {
            success: function() {
              deployedLanderCollection.each(function(location) {
                location.set("deploy_status", "modified");
              });
            }
          });

        },

        //whenever sidebar is open it has the real lander model as its model not a stupid sidebar model
        //sidebar model is just a mock thing to make loading work
        openSidebar: function(model) {
          var me = this;

          this.domainModel = model;

          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          var nameserversView = new NameserversView({
            model: model
          });

          //when optimizations modified save them and set correct deploy status
          //when changing deploy status must start with the deployed locations status
          //it will propogate up to the lander model
          nameserversView.on("modified", function() {

            me.updateToModified();


          });

          //show it
          Landerds.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);

          //optimization region view
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(nameserversView);

          //open
          setTimeout(this.sidebarView.openSidebar, 20);
        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Landerds.DomainsApp.RightSidebar.Controller;
  });
