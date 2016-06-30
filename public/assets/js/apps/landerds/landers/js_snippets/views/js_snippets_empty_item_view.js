define(["app",
    "tpl!assets/js/apps/landerds/landers/js_snippets/templates/empty.tpl"
  ],
 function(Landerds, EmptyTpl) {

  Landerds.module("LandersApp.Landers.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      template: EmptyTpl,
      tagName: "li",
      className: "empty-js-snippets-list-view"

      
    });
  });
  return Landerds.LandersApp.Landers.JsSnippets.List.EmptyView;
});