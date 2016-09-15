define(["app",
    "tpl!assets/js/apps/landerds/groups/list/templates/loading.tpl"
  ],
  function(Landerds, landersListLoadingTpl) {

    Landerds.module("GroupsApp.Groups.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.GroupsApp.Groups.List.LoadingView;
  });