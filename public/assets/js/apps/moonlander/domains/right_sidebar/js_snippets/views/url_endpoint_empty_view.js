define(["app",
    "tpl!/assets/js/apps/moonlander/domains/right_sidebar/js_snippets/templates/empty.tpl"
  ],
 function(Moonlander, EmptyViewTpl) {

  Moonlander.module("DomainsApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      tagName: "li",
      className: "snippets-empty",
      template: EmptyViewTpl
    });
  });
  return Moonlander.DomainsApp.RightSidebar.JsSnippets.List.EmptyView;
});