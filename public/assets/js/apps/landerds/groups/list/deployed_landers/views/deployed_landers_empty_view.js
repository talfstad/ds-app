define(["app",
    "tpl!assets/js/apps/landerds/groups/list/deployed_landers/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("GroupsApp.Groups.List.Deployed", function(Deployed, Landerds, Backbone, Marionette, $, _) {
      Deployed.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"
      });
    });
    return Landerds.GroupsApp.Groups.List.Deployed.EmptyView;
  });