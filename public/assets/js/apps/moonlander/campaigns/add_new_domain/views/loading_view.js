define(["app",
    "tpl!/assets/js/apps/moonlander/landers/deploy_to_domain/templates/loading.tpl"
  ],
  function(Moonlander, domainsListLoadingTpl) {

    Moonlander.module("LandersApp.DeployToDomain.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.LoadingView = Marionette.ItemView.extend({

        template: domainsListLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.DeployToDomain.List.LoadingView;
  });