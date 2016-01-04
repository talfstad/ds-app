define(["app",
    "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_layout_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/optimizations_view.js",
    "/assets/js/apps/moonlander/landers/dao/sidebar_model.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippets_list_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/menu_buttons_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/lander_modified_view.js"
  ],
  function(Moonlander, SidebarLayoutView, OptimizationsView, SidebarModel, ActiveJsSnippetsListView,
    SidebarMenuButtonsView, LanderModifiedView) {
    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        //needed to make animations correct sets width etc. for initial opening
        loadLandersSideMenu: function() {
          this.sidebarView = new SidebarLayoutView({
            model: new SidebarModel()
          });
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
        },


        //whenever sidebar is open it has the real lander model as its model not a stupid sidebar model
        //sidebar model is just a mock thing to make loading work
        openSidebar: function(model) {
          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          var optimizationView = new OptimizationsView({
            model: model
          });

          //when optimizations modified save them and set correct deploy status
          //when changing deploy status must start with the deployed locations status
          //it will propogate up to the lander model
          optimizationView.on("modified", function() {

            var deployedLocationCollection = model.get("deployedLocations");

            deployedLocationCollection.each(function(location) {
              location.set("deploy_status", "modified");
            });

          });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
          //deploy button region view
          var sidebarMenuButtonsView = new SidebarMenuButtonsView({
            model: model
          });

          var landerModifiedView = new LanderModifiedView({
            model: model
          });

          //active snippets region view
          this.showAndReFilterActiveSnippetsView(model);
          //menu buttons
          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.menuButtonsRegion.show(sidebarMenuButtonsView);
          //optimization region view
          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(optimizationView);
          //lander modified area
          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.landerModifiedRegion.show(landerModifiedView);
          //open
          setTimeout(this.sidebarView.openSidebar, 20);
        },

        showAndReFilterActiveSnippetsView: function(model) {
          //create the view here
          //only give it urlEndpoints with active snippets
          var urlEndpointsCollection = model.get("urlEndpoints");
          var activeSnippetsView = new ActiveJsSnippetsListView({
            collection: urlEndpointsCollection.filterWithActiveSnippets()
          });

          activeSnippetsView.on("childview:childview:editJsSnippetsModal", function(childView, childChildView, snippet_id, showDescription) {
            Moonlander.trigger("landers:showEditJsSnippetsModal", {
              "landerModel": model,
              "snippet_id": snippet_id,
              "showDescription": showDescription
            });
          });

          activeSnippetsView.on("childview:childview:deleteActiveJsSnippet", function(childView, childChildView, active_snippet_id) {

            //1. get the correct urlEndpoint model
            var snippetToDestroy = null;
            var endpointThisIsOn = null;

            urlEndpointsCollection.filterWithActiveSnippets().each(function(endpoint) {
              var activeSnippetsCollection = endpoint.get("activeSnippets");
              activeSnippetsCollection.each(function(snippet) {
                if (active_snippet_id == snippet.get("id")) {
                  //this is the correct endpoint and active snippet to remove
                  //2. remove the active snippet from it
                  endpointThisIsOn = endpoint;
                  snippetToDestroy = snippet;
                }
              });
            });

            if (snippetToDestroy) {
              snippetToDestroy.destroy();
            }

            //3. if no more active snippets on this, destroy it
            Moonlander.trigger("landers:sidebar:showSidebarActiveSnippetsView", model);

          });

          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView)

        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Moonlander.LandersApp.RightSidebar.Controller;
  });
