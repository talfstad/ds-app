define(["app",
    "tpl!assets/js/apps/landerds/domains/list/templates/loading.tpl"
  ],
  function(Landerds, landersListLoadingTpl) {

    Landerds.module("DomainsApp.Domains.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Landerds.DomainsApp.Domains.List.LoadingView;
  });