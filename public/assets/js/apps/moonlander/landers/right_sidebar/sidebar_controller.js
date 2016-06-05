define(["app",
    "assets/js/apps/moonlander/landers/right_sidebar/sidebar_layout_view",
    "assets/js/apps/moonlander/landers/right_sidebar/optimizations_view",
    "assets/js/apps/moonlander/landers/dao/sidebar_model",
    "assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippets_list_view",
    "assets/js/apps/moonlander/landers/right_sidebar/menu_buttons_view",
    "assets/js/apps/moonlander/landers/right_sidebar/lander_modified_view",
    "assets/js/common/notification",
  ],
  function(Moonlander, SidebarLayoutView, OptimizationsView, SidebarModel, ActiveJsSnippetsListView,
    SidebarMenuButtonsView, LanderModifiedView, Notification) {
    Moonlander.module("LandersApp.RightSidebar", function(RightSidebar, Moonlander, Backbone, Marionette, $, _) {

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

          var deployedLanderCollection = this.landerModel.get("deployedDomains");

          //1. set modified if it is deployed
          if (deployedLanderCollection.length > 0) {
            this.landerModel.set("modified", true);
          }
          //2. save it no matter what
          this.landerModel.save({}, {
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

          this.landerModel = model;

          this.sidebarView = new SidebarLayoutView({
            model: model
          });

          var optimizationView = new OptimizationsView({
            model: model
          });

          //when optimizations modified save them and set correct deploy status
          //when changing deploy status must start with the deployed locations status
          //it will propogate up to the lander model
          optimizationView.on("modified", function(isModified) {
            if (isModified) {
              model.set("modified", true);
            } else {
              model.set("modified", false);
            }
          });

          //show it
          Moonlander.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
          //deploy button region view
          var sidebarMenuButtonsView = new SidebarMenuButtonsView({
            model: model
          });

          sidebarMenuButtonsView.on("save", function() {
            //save optimized, deployment_folder_name, deploy_root
            model.save({}, {
              success: function(data) {
                if (data.error) {
                  //show fail message
                  Notification("Error Saving Lander", data.error.code, "danger", "stack_top_right");
                } else {

                  //update the deployment folder name for the deployed domains children links
                  model.get("deployedDomains").deployment_folder_name = model.get("deployment_folder_name");

                  //show success save message
                  Notification("Lander Saved", "Successfully Updated Lander", "success", "stack_top_right");
                  model.set("deploy_status", "not_deployed");

                }

              },
              error: function(errorMsg) {
                //show fail message
                Notification("Error Saving Lander", "", "danger", "stack_top_right");

              }
            });

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
          var me = this;
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

            me.updateToModifiedAndSave();

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
