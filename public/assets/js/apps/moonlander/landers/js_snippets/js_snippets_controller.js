define(["app",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_layout_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_list_view.js",
    "/assets/js/apps/moonlander/landers/dao/js_snippet_model.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_detail_view.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/apps/moonlander/landers/dao/js_snippet_collection.js"
  ],
  function(Moonlander, JsSnippetsLayoutView, LoadingView,
    LeftNavSnippetsView, SnippetModel, JsSnippetDetailView, FilteredPaginatedCollection) {
    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {

      JsSnippets.Controller = {

        showJsSnippetsModal: function(landerModel) {

          var jsSnippetsLayoutView = new JsSnippetsLayoutView({
            model: landerModel
          });


          jsSnippetsLayoutView.render();


          Moonlander.rootRegion.currentView.modalRegion.show(jsSnippetsLayoutView);

          //show loading
          var loadingView = new LoadingView();
          jsSnippetsLayoutView.leftNavSnippetListRegion.show(loadingView);


          var deferredJsSnippetCollection = Moonlander.request("landers:jsSnippetCollection");
          $.when(deferredJsSnippetCollection).done(function(jsSnippetCollection) {

            //TODO: create filterable collection from jsSnippetCollection
            var filteredSnippetCollection = FilteredPaginatedCollection({
              collection: jsSnippetCollection,
              paginated: false,
              filterFunction: function(filterCriterion) {
                var criterion = filterCriterion.toLowerCase();
                return function(snippet) {
                  if (snippet.get('name').toLowerCase().indexOf(criterion) !== -1) {
                    // || lander.get('last_updated').toLowerCase().indexOf(criterion) !== -1) {
                    // || lander.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1){
                    return snippet;
                  }
                };
              }
            });

            filteredSnippetCollection.urlEndpoints = landerModel.get("urlEndpoints");

            filteredSnippetCollection.on("add remove", function() {
              jsSnippetsLayoutView.model.set("totalNumJsSnippets", filteredSnippetCollection.length);
            });
            jsSnippetsLayoutView.model.set("totalNumJsSnippets", filteredSnippetCollection.length);


            jsSnippetsLayoutView.on("jsSnippets:filterList", function(filterVal) {
              filteredSnippetCollection.filter(filterVal);
            });

            //create left nav list of snippets
            var leftNavSnippetsView = new LeftNavSnippetsView({
              collection: filteredSnippetCollection
            });

            leftNavSnippetsView.on("childview:showSnippet", function(childViewOrModel) {
              var model = childViewOrModel.model || childViewOrModel;
              //1. set all active = false for collection
              jsSnippetCollection.each(function(snippet) {
                snippet.set("active", false);
              });
              model.set("active", true);
              model.set("editing", false);

              //2. figure out the available urlEndpoints
              var availableUrlEndpoints = [];
              var showingSnippetId = model.get("snippet_id");

              var urlEndpointCollection = landerModel.get("urlEndpoints");
              urlEndpointCollection.each(function(endpoint) {
                var isAvailable = true;
                var activeSnippetCollection = endpoint.get("activeSnippets");

                activeSnippetCollection.each(function(snippet) {
                  if (snippet.get("snippet_id") == showingSnippetId) {
                    isAvailable = false;
                  }
                });

                if (isAvailable)
                  availableUrlEndpoints.push({
                    id: endpoint.get("id"),
                    name: endpoint.get("name")
                  });
              });
              model.set("availableUrlEndpoints", availableUrlEndpoints);


              //3. show the new detail view with the model that was clicked
              var newSnippetDetailView = new JsSnippetDetailView({
                model: model
              });

              newSnippetDetailView.on("addSnippetToUrlEndpoint", function(attr) {
                var snippetModel = attr.model;
                var urlEndpointId = attr.urlEndpointId;


                //snippet models need a snippet_id because active snippet id is the actual id
                snippetModel.set({
                  "urlEndpointId": urlEndpointId,
                  "action": "addSnippetToUrlEndpoint"
                });


                //remove nested urlEndpoints since we're saving the snippet to a urlEndpoint it will
                //create circular structure
                snippetModel.save({}, {
                  success: function(savedModel, two, three) {

                    // add it to the colleciton
                    var urlEndpointCollection = landerModel.get("urlEndpoints");
                    var endpointToAddTo = urlEndpointCollection.get(urlEndpointId);

                    var endpointsActiveSnippetCollection = endpointToAddTo.get("activeSnippets");
                    endpointsActiveSnippetCollection.add(snippetModel);

                    // trigger a render by changing a value that triggers it
                    leftNavSnippetsView.trigger("childview:showSnippet", savedModel);
                  },
                  error: function() {

                  }
                });

              });

              jsSnippetsLayoutView.snippetDetailRegion.show(newSnippetDetailView);

            });


            //show actual views
            jsSnippetsLayoutView.leftNavSnippetListRegion.show(leftNavSnippetsView)

            //show initial snippets detail view/info/tutorial
            var firstModel = filteredSnippetCollection.models[0];
            firstModel.set("active", true);
            leftNavSnippetsView.trigger("childview:showSnippet", firstModel);

          });


        }

      }
    });

    return Moonlander.LandersApp.JsSnippets.Controller;
  });
