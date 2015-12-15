define(["app",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_layout_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_list_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_detail_view.js",
    "/assets/js/common/filtered_paginated/filtered_paginated_collection.js",
    "/assets/js/apps/moonlander/landers/dao/js_snippet_collection.js"
  ],
  function(Moonlander, JsSnippetsLayoutView, LoadingView,
    LeftNavSnippetsView, JsSnippetDetailView, FilteredPaginatedCollection) {
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

            filteredSnippetCollection.on("add remove", function(){
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

            leftNavSnippetsView.on("childview:showSnippet", function(childView) {
              //1. set all active = false for collection
              filteredSnippetCollection.each(function(snippet) {
                snippet.set("active", false);
              });
              childView.model.set("active", true);
              childView.model.set("editing", false);

              //2. show the new detail view with the model that was clicked
              var newSnippetDetailView = new JsSnippetDetailView({
                model: childView.model
              });
              jsSnippetsLayoutView.snippetDetailRegion.show(newSnippetDetailView);

            });


            //show actual views
            jsSnippetsLayoutView.leftNavSnippetListRegion.show(leftNavSnippetsView)

            //show initial snippets detail view/info/tutorial
            var firstModel = filteredSnippetCollection.models[0];
            firstModel.set("active", true);
            var snippetDetailView = new JsSnippetDetailView({
              model: firstModel
            });

            jsSnippetsLayoutView.snippetDetailRegion.show(snippetDetailView);

          });


        }

      }
    });

    return Moonlander.LandersApp.JsSnippets.Controller;
  });
