define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/templates/url_endpoint_active_snippet_list.tpl",
    "/assets/js/apps/moonlander/landers/right_sidebar/js_snippets/views/active_snippet_view.js"
  ],
 function(Moonlander, UrlEndpointActiveSnippetListTpl, ActiveSnippetView) {

  Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    
    List.UrlEndpointSnippetsView = Marionette.CompositeView.extend({

      initialize: function(){
        this.collection = this.model.get("activeSnippets");
      },
      tagName: "li",
      template: UrlEndpointActiveSnippetListTpl,
      childView: ActiveSnippetView,
      childViewContainer: "ul",
      className: "fancytree-page expanded",

      onRender: function(){

      }
    });
  });
  return Moonlander.LandersApp.RightSidebar.JsSnippets.List.UrlEndpointSnippetsView;
});