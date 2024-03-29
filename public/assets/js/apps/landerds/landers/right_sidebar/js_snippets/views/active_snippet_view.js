define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/js_snippets/templates/active_snippets_row.tpl"

  ],
  function(Landerds, ActiveSnippetRowTpl) {

    Landerds.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.ActiveSnippetRow = Marionette.ItemView.extend({
        template: ActiveSnippetRowTpl,
        tagName: "li",

        modelEvents: {
          "change:name": "render"
        },

        events: {
          "click .edit-snippet": "showEditSnippet",
          "click .delete-active-snippet": "deleteActiveSnippet",
          "click .fancytree-title": "showDescriptionSnippet",
          "click .fancytree-icon": "showDescriptionSnippet"
        },

        showEditSnippet: function() {
          this.trigger("editJsSnippetsModal", this.model.get("snippet_id"));
        },
        showDescriptionSnippet: function() {
          //second argument is show description if true defaults to show description
          this.trigger("editJsSnippetsModal", this.model.get("snippet_id"), true);
        },
        deleteActiveSnippet: function() {
          this.trigger("deleteActiveJsSnippet", this.model.get("id"));
        },

        onRender: function() {

        }

      });
    });

    return Landerds.LandersApp.RightSidebar.JsSnippets.List.ActiveSnippetRow;
  });
