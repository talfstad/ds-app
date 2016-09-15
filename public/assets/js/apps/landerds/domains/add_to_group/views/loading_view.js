define(["app",
    "tpl!assets/js/apps/landerds/domains/add_to_group/templates/loading.tpl"
  ],
  function(Landerds, groupListLoadingTpl) {

    Landerds.module("DomainsApp.AddToGroups.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: groupListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.DomainsApp.AddToGroups.List.LoadingView;
  });