define(["app",
    "assets/js/apps/landerds/landers/js_snippets/views/js_snippets_list_item_view",
    "assets/js/apps/landerds/landers/js_snippets/views/js_snippets_empty_item_view"
  ],
  function(Landerds, SnippetsListItem, SnippetsEmptyView) {

    Landerds.module("LandersApp.Landers.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.View = Marionette.CollectionView.extend({

        id: "snippets-list-collection",
        tagName: "ul",
        className: "nav sidebar-menu",
        emptyView: SnippetsEmptyView,
        childView: SnippetsListItem,

        // childViewOptions: function(model) {
        //   model.set("urlEndpoints", this.collection.urlEndpoints);
        // },

        initialize: function() {

        },

        onRender: function() {
          var me = this;
          var modalHeight = parseInt($(".modal-dialog").css("height"));
          me.$el.css("height", modalHeight - 160); //40 = width of search box

          $("#js-snippet-sidebar-search").focus();
          
        }

      });
    });
    return Landerds.LandersApp.Landers.JsSnippets.List.View;
  });
