define(["app",
    "/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/views/url_endpoint_child_view.js",
    "/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/views/url_endpoint_empty_view.js",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/templates/list.tpl"
    // "fancytree",
    // "bootstrap"
  ],
  function(Moonlander, listItemView, emptyView, listTpl) {

    Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CollectionView.extend({
        id: "jssnippets-tree",
        emptyView: emptyView,
        childView: listItemView,

        collectionEvents: {
          'change': 'render'
        },

        onRender: function(){

          //only fancy tree if have children
          var activeSnippetLength = this.children.length;
          if(activeSnippetLength > 0) {
            this.$el.addClass("fancytree-radio ui-fancytree-source");
            
            this.$el.fancytree({
              click: function(event, data) {
                var tree = $("#jssnippets-tree").fancytree("getActiveNode");
                // A node is about to be selected: prevent this, for folder-nodes:
                if (data.node.isFolder()) {
                  return false;
                }
              },
              renderNode: function(event, data) {
                // Optionally tweak data.node.span
                var node = data.node;
                var $span = $(node.span);


                if ($span.hasClass("fancytree-page")) {
                  $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file fs12 pr5"></i>');
                } else {
                  $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file-code-o text-success fs12 pr5"></i>');
                }

              }
            });
          }

        },
        
        onDomRefresh: function(e) {

        }
      });
    });

    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.View;
  });