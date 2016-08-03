define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/js_snippets/templates/url_endpoint_active_snippet_list.tpl",
    "assets/js/apps/landerds/landers/right_sidebar/js_snippets/views/active_snippet_view"
  ],
  function(Landerds, UrlEndpointActiveSnippetListTpl, ActiveSnippetView) {

    Landerds.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {

      List.UrlEndpointSnippetsView = Marionette.CompositeView.extend({

        initialize: function() {
          var me = this;
          this.collection = this.model.get("activeSnippets");
        },

        tagName: "li",
        template: UrlEndpointActiveSnippetListTpl,
        childView: ActiveSnippetView,
        childViewContainer: "ul",
        className: "fancytree-page expanded hidden",

        onRender: function() {
          this.shouldShow();
        },

        shouldShow: function() {
          if(this.model.get("id") == this.model.get("currentPreviewEndpointId")) {
            //should show
            this.$el.removeClass("hidden");
          } else {
            this.$el.addClass("hidden");
          }
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
    return Landerds.LandersApp.RightSidebar.JsSnippets.List.UrlEndpointSnippetsView;
  });
