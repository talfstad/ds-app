define(["app",
    "tpl!assets/js/apps/landerds/landers/list/active_groups/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("LandersApp.Landers.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"

      });
    });
    return Landerds.LandersApp.Landers.List.ActiveGroups.EmptyView;
  });
