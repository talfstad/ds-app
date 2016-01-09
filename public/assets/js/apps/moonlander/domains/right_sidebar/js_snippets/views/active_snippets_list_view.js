define(["app",
    "/assets/js/apps/moonlander/domains/right_sidebar/js_snippets/views/url_endpoint_child_view.js",
    "/assets/js/apps/moonlander/domains/right_sidebar/js_snippets/views/url_endpoint_empty_view.js",
    "tpl!/assets/js/apps/moonlander/domains/right_sidebar/js_snippets/templates/list.tpl",
  ],
  function(Moonlander, listItemView, emptyView, listTpl) {

    Moonlander.module("DomainsApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({

        emptyView: emptyView,
        childView: listItemView,
        tagName: "ul",
        className: "url-endpoints-list"
              
      });
    });

    return Moonlander.DomainsApp.RightSidebar.JsSnippets.List.View;
  });