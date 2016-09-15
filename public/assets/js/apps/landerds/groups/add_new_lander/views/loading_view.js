define(["app",
    "tpl!assets/js/apps/landerds/domains/deploy_new_lander/templates/loading.tpl"
  ],
  function(Landerds, domainsListLoadingTpl) {

    Landerds.module("DomainsApp.DeployNewLander.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: domainsListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.DomainsApp.DeployNewLander.List.LoadingView;
  });