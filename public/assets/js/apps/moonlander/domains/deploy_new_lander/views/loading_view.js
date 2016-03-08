define(["app",
    "tpl!assets/js/apps/moonlander/domains/deploy_new_lander/templates/loading.tpl"
  ],
  function(Moonlander, domainsListLoadingTpl) {

    Moonlander.module("DomainsApp.DeployNewLander.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: domainsListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.DomainsApp.DeployNewLander.List.LoadingView;
  });