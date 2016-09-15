define(["app",
    "tpl!assets/js/apps/landerds/groups/list/domains/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("GroupsApp.Groups.List.Domain", function(Domain, Landerds, Backbone, Marionette, $, _) {
      Domain.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        className: "dark",
        tagName: "tr"

      });
    });
    return Landerds.GroupsApp.Groups.List.Domain.EmptyView;
  });