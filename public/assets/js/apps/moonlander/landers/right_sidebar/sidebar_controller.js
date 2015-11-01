define(["app",
        "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_view.js",
        "/assets/js/apps/moonlander/landers/dao/lander_model.js",
        "/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/views/active_snippets_list_view.js"], 
function(Moonlander, SidebarView, LanderModel, ActiveJsSnippetsListView){
  Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _){

    RightSidebar.Controller = {
      
      loadLandersSideMenu: function(){
        Moonlander.landers.sidebarView = new SidebarView({
          model: new LanderModel()
        });
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);
      },

      openSidebar: function(model){
        Moonlander.landers.sidebarView = new SidebarView({
          model: model
        });
        
        //create the view here
        //only give it urlEndpoints with active snippets
        var urlEndpointsWithActiveSnippets = model.get("urlEndpoints").filterWithActiveSnippets();
        var activeSnippetsView = new ActiveJsSnippetsListView({
          collection: urlEndpointsWithActiveSnippets
        });

        //show it
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);

        Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView)
        //open
        setTimeout(Moonlander.landers.sidebarView.openSidebar, 20);
      },

      closeSidebar: function(){
        if(Moonlander.landers.sidebarView)
          Moonlander.landers.sidebarView.closeSidebar();
      }
    }
  });

  return Moonlander.LandersApp.RightSidebar.Controller;
});