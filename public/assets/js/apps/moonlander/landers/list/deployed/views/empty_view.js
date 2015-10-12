define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/empty.tpl"
  ],
 function(Moonlander, EmptyTpl) {

  Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.EmptyView = Marionette.ItemView.extend({
      template: EmptyTpl,
      tagName: "tr"
    });
  });
  return Moonlander.LandersApp.Landers.List.Deployed.EmptyView;
});
