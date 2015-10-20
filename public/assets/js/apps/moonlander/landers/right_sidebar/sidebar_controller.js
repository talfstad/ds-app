define(["app",
        "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_view.js",
        "/assets/js/apps/moonlander/landers/dao/lander_model.js",
        "/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/views/list_view.js",
        "/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/dao/collection.js"], 
function(Moonlander, SidebarView, LanderModel, JsSnippetsListView, JsSnippetsCollection){
  Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _){

    RightSidebar.Controller = {
      
      loadLandersSideMenu: function(){
        Moonlander.landers.sidebarView = new SidebarView({
          model: new LanderModel()
        });
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);
      },

      openSidebar: function(model){
        Moonlander.landers.sidebarView.model.set(model.attributes);


        //create active snippets array for lander
        var endpointsWithActiveSnippets = [];
        $.each(model.get("urlEndpoints"), function(idx, endpoint){
          if(endpoint.activeSnippets.length > 0)
            endpointsWithActiveSnippets.push(endpoint);
        });

        //create the view here
        var activeSnippetsView = new JsSnippetsListView({
          collection: new JsSnippetsCollection(endpointsWithActiveSnippets)
        });

        //show it
        Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView)
        //open
        Moonlander.landers.sidebarView.openSidebar();
      },

      closeSidebar: function(){
        Moonlander.landers.sidebarView.closeSidebar();
      }
    }
  });

  return Moonlander.LandersApp.RightSidebar.Controller;
});