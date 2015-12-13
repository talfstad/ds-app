define(["app",
    "/assets/js/apps/moonlander/landers/js_snippets/views/js_snippets_list_item_view.js",
    "tpl!/assets/js/apps/moonlander/landers/js_snippets/templates/js_snippets_empty_item_view.js"
  ],
  function(Moonlander, SnippetsListItem, SnippetsEmptyView) {

    Moonlander.module("LandersApp.JsSnippets.LeftNavList", function(LeftNavList, Moonlander, Backbone, Marionette, $, _) {
      LeftNavList.View = Marionette.CollectionView.extend({

        id: "snippets-list-collection",
        tagName: "ul",
        className: "nav sidebar-menu",
        emptyView: SnippetsEmptyView,
        childView: SnippetsListItem,

        initialize: function() {

        },

        //onRender builds the datatable object with our collection
        onRender: function() {
          var me = this;



        }

      });
    });
    return Moonlander.LandersApp.JsSnippets.LeftNavList.View;
  });
