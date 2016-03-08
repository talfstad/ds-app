define(["app",
    "tpl!assets/js/apps/moonlander/landers/right_sidebar/js_snippets/templates/empty.tpl"
  ],
 function(Moonlander, EmptyViewTpl) {

  Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      tagName: "li",
      className: "snippets-empty",
      template: EmptyViewTpl
    });
  });
  return Moonlander.LandersApp.RightSidebar.JsSnippets.List.EmptyView;
});