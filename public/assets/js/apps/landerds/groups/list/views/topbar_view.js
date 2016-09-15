define(["app",
    "tpl!assets/js/apps/landerds/groups/list/templates/topbar.tpl"
  ],
 function(Landerds, topbarTpl) {

  Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {
    List.TopbarView = Marionette.ItemView.extend({

      template: topbarTpl,

      modelEvents: {
        "change": "render"
      },

      onDomRefresh: function() {
        
        
      }

    });

  });
  return Landerds.GroupsApp.Groups.List.TopbarView;
});