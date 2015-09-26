define(["app",
        "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_view.js"], 
function(Moonlander, SidebarView){
  Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _){

    RightSidebar.Controller = {
      
      loadLandersSideMenu: function(){
        Moonlander.landers.sidebarView = new SidebarView();
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);
      },

      openSidebar: function(model){
        Moonlander.landers.sidebarView.openSidebar(model);
      },

      closeSidebar: function(){
        Moonlander.landers.sidebarView.closeSidebar();
      }
    }
  });

  return Moonlander.LandersApp.RightSidebar.Controller;
});