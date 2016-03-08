define(["app",
    "tpl!assets/js/apps/moonlander/landers/js_snippets/templates/empty.tpl"
  ],
 function(Moonlander, EmptyTpl) {

  Moonlander.module("LandersApp.Landers.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      template: EmptyTpl,
      tagName: "li",
      className: "empty-js-snippets-list-view"

      
    });
  });
  return Moonlander.LandersApp.Landers.JsSnippets.List.EmptyView;
});