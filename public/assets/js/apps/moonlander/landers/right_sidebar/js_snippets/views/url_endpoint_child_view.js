define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/templates/url_endpoint_active_snippet_list.tpl",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippet_view.js"
  ],
  function(Moonlander, UrlEndpointActiveSnippetListTpl, ActiveSnippetView) {

    Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.UrlEndpointSnippetsView = Marionette.CompositeView.extend({

        initialize: function() {
          var me = this;
          this.collection = this.model.get("activeSnippets");
        },

        tagName: "li",
        template: UrlEndpointActiveSnippetListTpl,
        childView: ActiveSnippetView,
        childViewContainer: "ul",
        className: "fancytree-page expanded",

        onRender: function() {

        },

        onDomRefresh: function() {
          //render fancy tree ONE TIME ONLY! use api to add/remove shit
          // this.drawFancyTree();
        },

        //method doesn't have state, model wont be correct here
        showEditSnippet: function(snippet_id) {
          this.trigger("editJsSnippetsModal", snippet_id);
        },

        //method doesn't have state, model wont be correct here
        deleteActiveSnippet: function(active_snippet_id) {
          this.trigger("deleteActiveJsSnippet", active_snippet_id);
        },

        drawFancyTree: function() {
          var me = this;
          //only fancy tree if have children
          $("#jssnippets-tree").fancytree({
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


              //EDIT EVENT FOR ON CLICK !
              // add all on click events
              $(data.node.li).find('a.edit-snippet').click(function(e) {
                var snippet_id = $(this).attr("data-snippet-id");
                me.showEditSnippet(snippet_id);
              });
              // DELETE event for on click :D
              $(data.node.li).find('a.delete-active-snippet').click(function(e) {
                var active_snippet_id = $(this).attr("data-id");
                me.deleteActiveSnippet(active_snippet_id);
              });


              if ($span.hasClass("fancytree-page")) {
                $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file fs12 pr5"></i>');
              } else {
                $span.find("> span.fancytree-icon").html('<i style="font-size: 18px !important" class="fa fa-file-code-o text-success fs12 pr5"></i>');
              }

            }
          });

        }
      });
    });
    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.UrlEndpointSnippetsView;
  });
