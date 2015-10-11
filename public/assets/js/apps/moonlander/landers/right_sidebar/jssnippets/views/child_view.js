define(["app",
    "tpl!/assets/js/apps/moonlander/landers/right_sidebar/jssnippets/templates/child.tpl"
  ],
 function(Moonlander, ChildViewTpl) {

  Moonlander.module("LandersApp.RightSidebar.JsSnippets.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.ChildView = Marionette.ItemView.extend({
      tagName: "li",
      className: "fancytree-page expanded",
      template: ChildViewTpl
    });
  });
  return Moonlander.LandersApp.RightSidebar.JsSnippets.List.ChildView;
});