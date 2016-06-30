define(["app",
    "assets/js/apps/landerds/landers/right_sidebar/js_snippets/views/url_endpoint_child_view",
    "assets/js/apps/landerds/landers/right_sidebar/js_snippets/views/url_endpoint_empty_view"
  ],
  function(Landerds, listItemView, emptyView) {

    Landerds.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({

        emptyView: emptyView,
        childView: listItemView,
        tagName: "ul",
        className: "url-endpoints-list"
              
      });
    });

    return Landerds.LandersApp.RightSidebar.JsSnippets.List.View;
  });
