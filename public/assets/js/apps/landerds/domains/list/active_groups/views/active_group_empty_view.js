define(["app",
    "tpl!assets/js/apps/landerds/domains/list/active_groups/templates/empty.tpl"
  ],
  function(Landerds, EmptyTpl) {

    Landerds.module("DomainsApp.Domains.List.ActiveGroups", function(ActiveGroups, Landerds, Backbone, Marionette, $, _) {
      ActiveGroups.EmptyView = Marionette.ItemView.extend({
        template: EmptyTpl,
        tagName: "tr",
        className: "dark"

      });
    });
    return Landerds.DomainsApp.Domains.List.ActiveGroups.EmptyView;
  });
