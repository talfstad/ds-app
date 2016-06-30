define(["app",
    "tpl!assets/js/apps/landerds/landers/right_sidebar/js_snippets/templates/empty.tpl"
  ],
 function(Landerds, EmptyViewTpl) {

  Landerds.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      tagName: "li",
      className: "snippets-empty",
      template: EmptyViewTpl
    });
  });
  return Landerds.LandersApp.RightSidebar.JsSnippets.List.EmptyView;
});