define(["app",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_layout_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/loading_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_list_view.js",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_detail_view.js",
    "/assets/js/apps/moonlander/landers/dao/js_snippet_collection.js",
  ],
  function(Moonlander, JsSnippetsLayoutView, LoadingView,
           LeftNavSnippetsView, JsSnippetDetailView) {
    Moonlander.module("LandersApp.JsSnippets", function(JsSnippets, Moonlander, Backbone, Marionette, $, _) {

      JsSnippets.Controller = {

        showJsSnippetsModal: function(landerModel) {

          var jsSnippetsLayoutView = new JsSnippetsLayoutView({
            model: landerModel
          });


          jsSnippetsLayoutView.render();

          //show loading
          var loadingView = new LoadingView();
          jsSnippetsLayoutView.leftNavSnippetListRegion.show(loadingView);

          Moonlander.rootRegion.currentView.modalRegion.show(jsSnippetsLayoutView);

          var deferredJsSnippetCollection = Moonlander.request("landers:jsSnippetCollection");
          $.when(deferredJsSnippetCollection).done(function(jsSnippetCollection) {

            //TODO: create filterable collection from jsSnippetCollection
            var filteredSnippetCollection = jsSnippetCollection;

            //create left nav list of snippets
            var leftNavSnippetsView = new LeftNavSnippetsView({
              collection: filteredSnippetCollection
            });

            //TODO: show initial snippets detail view/info/tutorial
            var snippetDetailView = new JsSnippetDetailView({});

            //show actual views
            jsSnippetsLayoutView.leftNavSnippetListRegion.show(leftNavSnippetsView)
            jsSnippetsLayoutView.snippetDetailRegion.show(snippetDetailView);
          });


        }

      }
    });

    return Moonlander.LandersApp.JsSnippets.Controller;
  });
