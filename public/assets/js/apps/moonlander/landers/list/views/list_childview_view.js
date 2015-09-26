define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/landers_child_item.tpl",
    "fancytree",
    "bootstrap"
  ],
 function(Moonlander, landersListItemTpl) {

  Moonlander.module("LandersApp.List", function(List, Moonlander, Backbone, Marionette, $, _) {
    List.childView = Marionette.ItemView.extend({

      template: landersListItemTpl,

      onDomRefresh: function() {}

    });
  });
  return Moonlander.LandersApp.List.childView;
});
