define(["app",
    "/assets/js/apps/moonlander/landers/list/deployed/views/child_view.js",
    "/assets/js/apps/moonlander/landers/list/deployed/views/empty_view.js",
    "tpl!/assets/js/apps/moonlander/landers/list/deployed/templates/list.tpl",
    "fancytree",
    "bootstrap"
  ],
  function(Moonlander, ChildView, EmptyView, ListTpl) {

    Moonlander.module("LandersApp.Landers.List.Deployed", function(List, Moonlander, Backbone, Marionette, $, _) {

      List.View = Marionette.CompositeView.extend({

        template: ListTpl,
        emptyView: EmptyView,
        childView: ChildView,
        childViewContainer: "tbody",
      });

    });
    return Moonlander.LandersApp.Landers.List.Deployed.View;
  });