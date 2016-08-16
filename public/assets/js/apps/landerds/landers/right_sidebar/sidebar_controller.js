define(["app",
    "assets/js/apps/landerds/landers/right_sidebar/sidebar_layout_view",
    "assets/js/apps/landerds/landers/right_sidebar/deployment_options_view",
    "assets/js/apps/landerds/landers/right_sidebar/url_endpoints_view",
    "assets/js/apps/landerds/landers/right_sidebar/pagespeed_view",
    "assets/js/apps/landerds/landers/dao/sidebar_model",
    "assets/js/apps/landerds/landers/right_sidebar/js_snippets/views/active_snippets_list_view",
    "assets/js/apps/landerds/landers/right_sidebar/menu_buttons_view",
    "assets/js/apps/landerds/landers/right_sidebar/lander_modified_view",
    "assets/js/common/notification",
  ],
  function(Landerds, SidebarLayoutView, DeploymentOptionsView, UrlEndpointsView, PagespeedView, SidebarModel, ActiveJsSnippetsListView,
    SidebarMenuButtonsView, LanderModifiedView, Notification) {
    Landerds.module("LandersApp.RightSidebar", function(RightSidebar, Landerds, Backbone, Marionette, $, _) {

      RightSidebar.Controller = {

        sidebarView: null,

        landerModel: null,

        //save even if not modified because it might not be deployed
        //in which case we would want to save it anyway
        updateToModified: function(affectedLanderIds) {

          this.landerModel.set("modified", true);

          var deployedLanderCollection = this.landerModel.get("deployedDomains");

          //1. set modified if it is deployed
          if (deployedLanderCollection.length > 0) {
            this.landerModel.set("modified", true);
          }
          //2. save it no matter what
          deployedLanderCollection.each(function(location) {
            location.set("modified", true);
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

          var deploymentOptionsView = new DeploymentOptionsView({
            model: model
          });

          var urlEndpointsView = new UrlEndpointsView({
            model: model
          })

          var pagespeedView = new PagespeedView({
            model: model
          });

          //when optimizations modified save them and set correct deploy status
          //when changing deploy status must start with the deployed locations status
          //it will propogate up to the lander model
          deploymentOptionsView.on("modified", function(isModified) {
            if (isModified) {
              model.set("modified", true);
            } else {
              model.set("modified", false);
            }
          });

          //show it
          Landerds.rootRegion.currentView.rightSidebarRegion.show(this.sidebarView);
          //deploy button region view
          var sidebarMenuButtonsView = new SidebarMenuButtonsView({
            model: model
          });


          sidebarMenuButtonsView.on("save", function() {
            //save optimized, deployment_folder_name, deploy_root
            model.save({}, {
              success: function(dataModel) {

                model.set({
                  saving_lander: false,
                  no_optimize_on_save: true,
                  modified: false
                });

                var error = dataModel.get("error");

                if (error) {
                  //show fail message
                  Notification("Error Saving Lander", error.code, "danger", "stack_top_right");

                  //error so its still modified
                  model.set("modified", true);

                  model.unset("error");

                } else {

                  //update the endpoints pagespeed scores !
                  if (!dataModel.get("no_optimize_on_save")) {
                    var urlEndpointCollection = model.get("urlEndpoints");
                    //update the urlEndpoints pagespeed scores
                    var urlEndpointsArr = dataModel.get("url_endpoints_arr");
                    $.each(urlEndpointsArr, function(idx, item) {

                      //get url endpoint
                      urlEndpointCollection.each(function(endpoint) {
                        if (endpoint.get("filename") == item.filename) {
                          //update this endpoint's pagespeed score
                          endpoint.set({
                            original_pagespeed: item.original_pagespeed,
                            optimized_pagespeed: item.optimized_pagespeed
                          });
                        }
                      });

                    });

                    //re-render the pagespeed view
                    if (!pagespeedView.isDestroyed) {
                      pagespeedView.render();
                    }
                  }


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
          //menu buttons
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.menuButtonsRegion.show(sidebarMenuButtonsView);
          //lander modified area
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.landerModifiedRegion.show(landerModifiedView);
          //url endpoints view
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.urlEndpointsRegion.show(urlEndpointsView);
          //pagespeed endpoints view
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.pagespeedRegion.show(pagespeedView);
          //deployment options region view
          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.deploymentOptionsRegion.show(deploymentOptionsView);

          this.showAndReFilterActiveSnippetsView(model);


          setTimeout(this.sidebarView.openSidebar, 20);
        },

        showAndReFilterActiveSnippetsView: function(model) {
          var me = this;
          //create the view here
          //only give it urlEndpoints with active snippets



          var urlEndpointsCollection = model.get("urlEndpoints");
          //childview options for urlEndpointsCollection

          var activeSnippetCollection = urlEndpointsCollection.filterForCurrentPreviewId(model.get("currentPreviewEndpointId"));

          // activeSnippetCollection.currentPreviewEndpointId = model.get("currentPreviewEndpointId");

          var activeSnippetsView = new ActiveJsSnippetsListView({
            collection: activeSnippetCollection
          });

          // activeSnippetsView.on("childview:childview:destroy", function(one, two) {
          //   alert("active snippet removed");

          // });

          activeSnippetsView.on("childview:childview:editJsSnippetsModal", function(childView, childChildView, snippet_id, showDescription) {
            Landerds.trigger("landers:showEditJsSnippetsModal", {
              "landerModel": model,
              "snippet_id": snippet_id,
              "showDescription": showDescription
            });
          });

          activeSnippetsView.on("childview:childview:deleteActiveJsSnippet", function(childView, childChildView, active_snippet_id) {

            if (!model.get("saving_lander")) {
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

              me.landerModel.set("saving_lander", true);

              if (snippetToDestroy) {
                snippetToDestroy.destroy({
                  success: function(model, response) {
                    
                    me.landerModel.set({
                      saving_lander: false,
                      no_optimize_on_save: false
                    });
                    
                  }
                });
              }

              me.updateToModified();

              //3. if no more active snippets on this, destroy it
              Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", model);

            }

          });



          Landerds.rootRegion.currentView.rightSidebarRegion.currentView.snippetsRegion.show(activeSnippetsView);

        },

        closeSidebar: function() {
          if (this.sidebarView)
            this.sidebarView.closeSidebar();
        }
      }
    });

    return Landerds.LandersApp.RightSidebar.Controller;
  });
