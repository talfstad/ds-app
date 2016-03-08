define(["app",
    "tpl!assets/js/apps/moonlander/domains/list/templates/loading.tpl"
  ],
  function(Moonlander, landersListLoadingTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: landersListLoadingTpl,

        onBeforeRender: function() {

        }

      });
    });
    return Moonlander.DomainsApp.Domains.List.LoadingView;
  });