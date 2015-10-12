define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/child.tpl",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/empty_view.tpl",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/child_view.tpl",
  ],
 function(Moonlander, ChildTpl, EmptyView, ChildView) {

  Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.ChildView = Marionette.ItemView.extend({
      template: ChildTpl,
      tagName: "tr"
    });
  });
  return Moonlander.LandersApp.Landers.List.Deployed.ChildView;
});
