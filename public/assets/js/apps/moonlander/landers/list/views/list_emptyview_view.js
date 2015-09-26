define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_empty_items.tpl",
    "fancytree",
    "bootstrap"
  ],
 function(Moonlander, landersListEmptyItemsTpl) {

  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.emptyView = Marionette.ItemView.extend({

      template: landersListEmptyItemsTpl,

      onDomRefresh: function() {}

    });
  });
  return Moonlander.LandersApp.List.emptyView;
});
