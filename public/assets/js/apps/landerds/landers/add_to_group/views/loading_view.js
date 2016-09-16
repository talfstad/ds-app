define(["app",
    "tpl!assets/js/apps/landerds/landers/add_to_group/templates/loading.tpl"
  ],
  function(Landerds, groupListLoadingTpl) {

    Landerds.module("LandersApp.AddToGroup.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: groupListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.LandersApp.AddToGroup.List.LoadingView;
  });