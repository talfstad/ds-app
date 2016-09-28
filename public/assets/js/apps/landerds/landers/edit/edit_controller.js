define(["app",
    "assets/js/apps/landerds/landers/edit/views/edit_layout_view",
    "assets/js/apps/landerds/landers/edit/views/loading_view",
    "assets/js/apps/landerds/landers/edit/views/edit_list_view",
    "assets/js/apps/landerds/landers/dao/js_snippet_model",
    "assets/js/apps/landerds/landers/edit/views/edit_detail_view",
    "assets/js/common/filtered_paginated/filtered_paginated_collection",
    "assets/js/apps/landerds/landers/edit/views/edit_totals_view",
    "assets/js/apps/landerds/landers/right_sidebar/js_snippets/dao/active_js_snippet_model",
    "assets/js/apps/landerds/landers/edit/views/empty_snippets_detail_view",
    "assets/js/apps/landerds/landers/edit/views/create_new_snippet_view",
    "assets/js/apps/landerds/landers/dao/js_snippet_collection"
  ],
  function(Landerds, JsSnippetsLayoutView, LoadingView,
    LeftNavSnippetsView, SnippetModel, JsSnippetDetailView, FilteredPaginatedCollection,
    JsSnippetTotalsView, ActiveSnippetModel, EmptySnippetsDetailView, CreateNewSnippetView) {
    Landerds.module("LandersApp.Landers.Edit", function(Edit, Landerds, Backbone, Marionette, $, _) {

      Edit.Controller = {

        jsSnippetsLayoutView: {},

        initAndShowEditModal: function(landerModel) {
          var me = this;
          var defer = $.Deferred();

          var jsSnippetsLayoutView = new JsSnippetsLayoutView({
            model: landerModel
          });

          //set to global
          this.jsSnippetsLayoutView = jsSnippetsLayoutView;

          jsSnippetsLayoutView.render();

          Landerds.rootRegion.currentView.modalRegion.show(jsSnippetsLayoutView);

          //show loading
          var loadingView = new LoadingView();
          jsSnippetsLayoutView.leftNavSnippetListRegion.show(loadingView);


          var deferredJsSnippetCollection = Landerds.request("landers:jsSnippetCollection");
          $.when(deferredJsSnippetCollection).done(function(jsSnippetCollection) {

            //TODO: create filterable collection from jsSnippetCollection
            var filteredSnippetCollection = FilteredPaginatedCollection({
              collection: jsSnippetCollection,
              paginated: false,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(snippet) {
                  if (snippet.get('name').toLowerCase().indexOf(criterion) !== -1) {
                    return snippet;
                  }
                };
              }
            });

            filteredSnippetCollection.urlEndpoints = landerModel.get("urlEndpoints");

            var jsSnippetTotalsView = new JsSnippetTotalsView({
              snippet_collection: filteredSnippetCollection
            });

            // jsSnippetsLayoutView.on("showCreateNewSnippetView", function() {
            //   //remove 'active' from all snippets
            //   filteredSnippetCollection.original.each(function(snippet) {
            //     snippet.set("active", false);
            //   });

            //   //create a new snippet view and show it!
            //   var newSnippetModel = new SnippetModel();

            //   var createNewSnippetView = new CreateNewSnippetView({
            //     model: newSnippetModel
            //   });

            //   createNewSnippetView.on("saveNewSnippet", function() {
            //     this.model.set("savingNewSnippet", true);

            //     //now save it to the server
            //     this.model.save({}, {
            //       success: function(savedModel) {
            //         //add to snippet list collection
            //         filteredSnippetCollection.add(savedModel);
            //         //update totals
            //         jsSnippetTotalsView.trigger("updateSnippetTotals");
            //         //trigger finishing on success
            //         savedModel.set("savingNewSnippet", "finished");
            //         //select it
            //         leftNavSnippetsView.trigger("childview:showSnippet", savedModel);
            //       }
            //     });
            //   });

            //   createNewSnippetView.on("cancelNewSnippet", function() {
            //     //once removed, show the first model if we have one, or the default view
            //     var firstModel = filteredSnippetCollection.models[0];
            //     if (!firstModel) {
            //       me.showEmptySnippetsDetailView();
            //     } else {
            //       leftNavSnippetsView.trigger("childview:showSnippet", firstModel);
            //     }
            //   });

            //   me.jsSnippetsLayoutView.snippetDetailRegion.show(createNewSnippetView);

            // });

            // //create left nav list of snippets
            var leftNavSnippetsView = new LeftNavSnippetsView({
              collection: filteredSnippetCollection
            });

            // jsSnippetsLayoutView.on("jsSnippets:filterList", function(filterVal) {
            //   filteredSnippetCollection.filter(filterVal);
            // });

            // leftNavSnippetsView.on("childview:showSnippet", function(childViewOrModel) {
            //   var model = childViewOrModel.model || childViewOrModel;
            //   //1. set all active = false for collection
            //   jsSnippetCollection.each(function(snippet) {
            //     snippet.set("active", false);
            //   });
            //   model.set("active", true);

            //   //2. figure out the available urlEndpoints
            //   var availableUrlEndpoints = [];
            //   var showingSnippetId = model.get("snippet_id");

            //   var urlEndpointCollection = landerModel.get("urlEndpoints");

            //   var currentShowingEndpoint = urlEndpointCollection.get(landerModel.get("currentPreviewEndpointId"));

            //   //snippet available for endpoint?
            //   var isAvailable = true;
            //   var activeSnippetCollection = currentShowingEndpoint.get("activeSnippets");
            //   activeSnippetCollection.each(function(snippet) {
            //     if (snippet.get("snippet_id") == showingSnippetId) {
            //       isAvailable = false;
            //     }
            //   });

            //   //set initial saving
            //   model.set("saving_lander", landerModel.get("saving_lander"));
            //   //update if change
            //   landerModel.on("change:saving_lander", function(landerModel, val) {
            //     model.set("saving_lander", val);
            //   });

            //   if (!currentShowingEndpoint) {
            //     //if no endpoint just set saving_lander so we disable it
            //     model.set("availableEndpointId", null);
            //   } else {
            //     if (isAvailable) {

            //       model.set("availableEndpointId", currentShowingEndpoint.get("id"));
                  
            //     } else {
            //       model.set("availableEndpointId", null);
            //     }
            //   }

            //   //3. show the new detail view with the model that was clicked
            //   var newSnippetDetailView = new JsSnippetDetailView({
            //     model: model
            //   });

            //   newSnippetDetailView.on("addSnippetToUrlEndpoint", function(attr) {
            //     var snippetModel = attr.model;
            //     var urlEndpointId = attr.urlEndpointId;
            //     var landerId = me.jsSnippetsLayoutView.model.get("id");
            //     //1. show that we are addingToPage, set addingToPage=true causes render
            //     snippetModel.set("addingToPage", true);

            //     //create an active snippet model for this
            //     var newActiveSnippetModel = new ActiveSnippetModel({
            //       "name": snippetModel.get("name"),
            //       "snippet_id": snippetModel.get("snippet_id"),
            //       "id": snippetModel.get("id"),
            //       "action": "addSnippetToUrlEndpoint",
            //       "urlEndpointId": urlEndpointId,
            //       "lander_id": landerId
            //     });

            //     //set no optimize on save false when add snippet!
            //     landerModel.set({
            //       saving_lander: true
            //     });

            //     newActiveSnippetModel.save({}, {
            //       success: function(activeSnippetModel, two, three) {

            //         landerModel.set({
            //           saving_lander: false,
            //           no_optimize_on_save: false
            //         });

            //         // add it to the colleciton
            //         var urlEndpointCollection = landerModel.get("urlEndpoints");
            //         var endpointToAddTo = urlEndpointCollection.get(urlEndpointId);

            //         var endpointsActiveSnippetCollection = endpointToAddTo.get("activeSnippets");

            //         endpointsActiveSnippetCollection.add(newActiveSnippetModel);

            //         Landerds.trigger("landers:updateToModified");

            //         Landerds.trigger("landers:sidebar:showSidebarActiveSnippetsView", landerModel);
            //         //set addingToPage to 'finished' to show the finished message and remove
            //         snippetModel.set("addingToPage", "finished");

            //         // trigger a render by changing a value that triggers it
            //         leftNavSnippetsView.trigger("childview:showSnippet", snippetModel);
            //       },
            //       error: function() {

            //       }
            //     });

            //   });

            //   newSnippetDetailView.on("saveCode", function(code) {

            //     var snippetModel = this.model;

            //     snippetModel.set({
            //       "code": code,
            //       "action": "saveCode"
            //     });

            //     snippetModel.set("savingCode", true);

            //     snippetModel.save({}, {
            //       success: function(savedModel, affectedLanderIds, three) {
            //         savedModel.set("originalSnippetCode", savedModel.get("code"));
            //         savedModel.set("savingCode", "finished");

            //         //set all landers in the response object (affectedLanderIds) to modified because they
            //         //are modified in the db
            //         Landerds.trigger("landers:updateAffectedLanderIdsToModified", affectedLanderIds);
            //       },
            //       error: function() {

            //       }
            //     });
            //   });

            //   newSnippetDetailView.on("deleteSnippet", function() {
            //     var snippetModel = this.model;

            //     //starting delete snippet
            //     snippetModel.set("deletingSnippet", true);

            //     snippetModel.destroy({
            //       success: function(deletedModel, affectedLanders) {

            //         //  . remove active snippets from landers
            //         Landerds.trigger("landers:updateAffectedLanderIdsRemoveActiveSnippets", affectedLanders);

            //         jsSnippetTotalsView.trigger("updateSnippetTotals");

            //         //once removed, show the first model if we have one, or the default view
            //         var firstModel = filteredSnippetCollection.models[0];
            //         if (!firstModel) {
            //           me.showEmptySnippetsDetailView();
            //         } else {
            //           //set alert delete to finished on this model so
            //           //when we show the new model it shows delete successful message
            //           firstModel.set("deletingSnippet", "finished");

            //           leftNavSnippetsView.trigger("childview:showSnippet", firstModel);
            //         }
            //       }
            //     });

            //   });


            //   newSnippetDetailView.on("saveEditInfo", function(attr) {
            //     var snippetModel = attr.model;
            //     var name = attr.name;
            //     var description = attr.description;

            //     var loadBeforeDom = attr.loadBeforeDom;

            //     snippetModel.set({
            //       "name": name,
            //       "description": description,
            //       "load_before_dom": loadBeforeDom,
            //       "action": "saveEditInfo"
            //     });

            //     snippetModel.set("savingEditInfo", true);

            //     snippetModel.save({}, {
            //       success: function(savedModel, two, three) {

            //         //sort it now that the name probably changed
            //         filteredSnippetCollection.sort();

            //         //get the actual snippet model and change the name/description of it
            //         //those models are different than the actual snippet models
            //         Landerds.trigger("landers:updateAllActiveSnippetNames", savedModel);

            //         savedModel.set("showEditInfo", false);
            //         savedModel.set("savingEditInfo", "finished");

            //       },
            //       error: function() {

            //       }
            //     })
            //   });

            //   jsSnippetsLayoutView.snippetDetailRegion.show(newSnippetDetailView);

            // });


            //show actual views
            jsSnippetsLayoutView.leftNavSnippetListRegion.show(leftNavSnippetsView)
            jsSnippetsLayoutView.snippetTotalsRegion.show(jsSnippetTotalsView);

            defer.resolve({
              filteredSnippetCollection: filteredSnippetCollection,
              leftNavSnippetsView: leftNavSnippetsView
            });

          });
          var promise = defer.promise();
          return promise;

        },

        //called to show the empty view for detailed area
        showEmptySnippetsDetailView: function() {

          var emptySnippetsDetailView = new EmptySnippetsDetailView();
          this.jsSnippetsLayoutView.snippetDetailRegion.show(emptySnippetsDetailView);


        },

        showEditModal: function(landerModel) {
          var me = this;
          var deferInitJsSnippetsModal = this.initAndShowEditModal(landerModel);

          $.when(deferInitJsSnippetsModal).done(function(attr) {

            var filteredSnippetCollection = attr.filteredSnippetCollection;
            var leftNavSnippetsView = attr.leftNavSnippetsView;

            //show initial snippets detail view/info/tutorial
            // var firstModel = filteredSnippetCollection.models[0];
            // if (firstModel) {
            //   firstModel.set("active", true);
            //   firstModel.set("editing", false);
            //   leftNavSnippetsView.trigger("childview:showSnippet", firstModel);
            // } else {
            //   me.showEmptySnippetsDetailView();
            // }

          });
        },

        showEmptyJsSnippetsModal: function(landerModel) {

          var me = this;
          var deferInitJsSnippetsModal = this.initAndShowEditModal(landerModel);

          $.when(deferInitJsSnippetsModal).done(function(attr) {

            var filteredSnippetCollection = attr.filteredSnippetCollection;
            var leftNavSnippetsView = attr.leftNavSnippetsView;

            me.showEmptySnippetsDetailView();

          });

        },

        showEditLander: function(landerModel) {
          var deferInitEditModal = this.initAndShowEditModal(landerModel);

          $.when(deferInitEditModal).done(function(attr) {

            // var filteredFileCollection = attr.filteredFileCollection;
            // var leftNavView = attr.leftNavView;
            
            // var leftNavSnippetsView = attr.leftNavView;

            // TODO show a blank page to start typing (new file default)

            // var modelToEdit = filteredFileCollection.get(snippet_id);
            // modelToEdit.set("active", true);
            // if (showDescription) {
            //   modelToEdit.set("editing", false);
            // } else {
            //   modelToEdit.set("editing", true);
            // }

            // leftNavSnippetsView.trigger("childview:showSnippet", modelToEdit);

          });

        },

      }
    });

    return Landerds.LandersApp.Landers.Edit.Controller;
  });
