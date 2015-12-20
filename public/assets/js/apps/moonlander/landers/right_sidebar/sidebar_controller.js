define(["app",
        "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_layout_view.js",
        "/assets/js/apps/moonlander/landers/right_sidebar/name_optimizations_view.js",
        "/assets/js/apps/moonlander/landers/dao/sidebar_model.js",
        "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippets_list_view.js"], 
function(Moonlander, SidebarLayoutView, NameAndOptimizationsView, SidebarModel, ActiveJsSnippetsListView){
  Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _){

    RightSidebar.Controller = {
      
      //needed to make animations correct sets width etc. for initial opening
      loadLandersSideMenu: function(){
        Moonlander.landers.sidebarView = new SidebarLayoutView({
          model: new SidebarModel()
        });
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);
      },

      openSidebar: function(model){
        Moonlander.landers.sidebarView = new SidebarLayoutView({
          model: model
        });
        

        //create the view here
        //only give it urlEndpoints with active snippets
        var urlEndpointsCollection = model.get("urlEndpoints");
        var activeSnippetsView = new ActiveJsSnippetsListView({
          collection: urlEndpointsCollection
        });

        //weird looking but bc the views are nested its a double childview
        activeSnippetsView.on("childview:childview:editJsSnippetsModal", function(urlEndpointView, snippetView, snippet_id){
          Moonlander.trigger("landers:showEditJsSnippetsModal", {
            "landerModel": model, 
            "snippet_id": snippet_id
          });
        }); 

        var nameAndOptimizationView = new NameAndOptimizationsView({
          model: model
        });

        //show it
        Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);

        Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView)
        Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(nameAndOptimizationView)
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