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

        //method doesn't have state, model wont be correct here
        showEditSnippet: function(snippet_id) {
          this.trigger("editJsSnippetsModal", snippet_id);
        },

        //method doesn't have state, model wont be correct here
        deleteActiveSnippet: function(active_snippet_id) {
          this.trigger("deleteActiveJsSnippet", active_snippet_id);
        }

      });
    });
    return Moonlander.LandersApp.RightSidebar.JsSnippets.List.UrlEndpointSnippetsView;
  });
