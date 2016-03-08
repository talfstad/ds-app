define(["app",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/url_endpoint_child_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/url_endpoint_empty_view.js"
  ],
  function(Moonlander, listItemView, emptyView) {

    Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({

        emptyView: emptyView,
        childView: listItemView,
        tagName: "ul",
        className: "url-endpoints-list"
              
      });
    });

    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.View;
  });
