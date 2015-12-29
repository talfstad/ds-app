define(["app",
    "/assets/js/apps/moonlander/landers/right_sidebar/sidebar_layout_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/optimizations_view.js",
    "/assets/js/apps/moonlander/landers/dao/sidebar_model.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippets_list_view.js"
  ],
  function(Moonlander, SidebarLayoutView, NameAndOptimizationsView, SidebarModel, ActiveJsSnippetsListView) {
    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        //needed to make animations correct sets width etc. for initial opening
        loadLandersSideMenu: function() {
          Moonlander.landers.sidebarView = new SidebarLayoutView({
            model: new SidebarModel()
          });
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);
        },

        openSidebar: function(model) {
          Moonlander.landers.sidebarView = new SidebarLayoutView({
            model: model
          });
          
          var nameAndOptimizationView = new NameAndOptimizationsView({
            model: model
          });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(Moonlander.landers.sidebarView);

          this.showAndReFilterActiveSnippetsView(model);

          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(nameAndOptimizationView)
            //open
          setTimeout(Moonlander.landers.sidebarView.openSidebar, 20);
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
          if (Moonlander.landers.sidebarView)
            Moonlander.landers.sidebarView.closeSidebar();
        }
      }
    });

    return Moonlander.LandersApp.RightSidebar.Controller;
  });
