define(["app",
    "tpl!assets/js/apps/landerds/landers/deploy_to_domain/templates/loading.tpl"
  ],
  function(Landerds, domainsListLoadingTpl) {

    Landerds.module("LandersApp.DeployToDomain.List", function(List, Landerds, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: domainsListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.LandersApp.DeployToDomain.List.LoadingView;
  });