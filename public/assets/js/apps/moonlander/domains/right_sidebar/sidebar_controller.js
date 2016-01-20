define(["app",
    "/assets/js/apps/moonlander/domains/right_sidebar/sidebar_layout_view.js",
    "/assets/js/apps/moonlander/domains/dao/sidebar_model.js",
    "/assets/js/apps/moonlander/domains/right_sidebar/nameservers_view.js" 
  ],
  function(Moonlander, SidebarLayoutView, SidebarModel, NameserversView) {
    Moonlander.module("DomainsApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        landerModel: null,

        //needed to make animations correct sets width etc. for initial opening
        loadLandersSideMenu: function() {
          this.landerModel = new SidebarModel();

          this.sidebarView = new SidebarLayoutView({
            model: this.landerModel
          });

          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
        },

        //save even if not modified because it might not be deployed
        //in which case we would want to save it anyway
        updateToModifiedAndSave: function() {

          var deployedLocationCollection = this.landerModel.get("deployedLocations");

          //1. set modified if it is deployed
          if (deployedLocationCollection.length > 0) {
            this.landerModel.set("modified", true);
          }
          //2. save it no matter what
          this.landerModel.save({}, {
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

          this.landerModel = model;

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

            me.updateToModifiedAndSave();


          });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);

          //optimization region view
          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.nameAndOptimizationsRegion.show(nameserversView);

          //open
          setTimeout(this.sidebarView.openSidebar, 20);
        },

        showAndReFilterActiveSnippetsView: function(model) {
          var me = this;
          //create the view here
          //only give it urlEndpoints with active snippets
          var urlEndpointsCollection = model.get("urlEndpoints");
          var activeSnippetsView = new ActiveJsSnippetsListView({
            collection: urlEndpointsCollection.filterWithActiveSnippets()
          });

          activeSnippetsView.on("childview:childview:editJsSnippetsModal", function(childView, childChildView, snippet_id, showDescription) {
            Moonlander.trigger("domains:showEditJsSnippetsModal", {
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

            me.updateToModifiedAndSave();

            //3. if no more active snippets on this, destroy it
            Moonlander.trigger("domains:sidebar:showSidebarActiveSnippetsView", model);

          });

          Moonlander.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView)

        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Moonlander.DomainsApp.RightSidebar.Controller;
  });
