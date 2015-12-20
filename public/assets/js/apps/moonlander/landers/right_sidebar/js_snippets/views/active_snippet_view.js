define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/templates/active_snippets_row.tpl"
    // "fancytree",
    // "bootstrap"
  ],
  function(Moonlander, ActiveSnippetRowTpl) {

    Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.ActiveSnippetRow = Marionette.ItemView.extend({
        template: ActiveSnippetRowTpl,
        tagName: "li",

        modelEvents: {
          "change:name": "render"
        },

        showEditSnippet: function(snippet_id) {
          this.trigger("editJsSnippetsModal", snippet_id);
        },

        onRender: function() {

        },

        onDomRefresh: function(e) {
          var me = this;
          this.drawFancyTree();

          //has to be after drawing fancy tree..
          var id = this.model.get("id");
          $("#edit-snippet-" + id).click(function(e) {
            e.preventDefault();

            me.showEditSnippet();
          });
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

              var snippet_id = $(data.node.li).find('a.edit-snippet').attr("data-snippet-id");
              me.showEditSnippet(snippet_id);
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
      });
    });

    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.ActiveSnippetRow;
  });
