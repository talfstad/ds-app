define(["app",
    "tpl!/assets/js/apps/moonlander/landers/list/templates/deploy_to_new_domain.tpl"
  ],
  function(Moonlander, DeployToNewDomainTpl) {

    Moonlander.module("LandersApp.Landers.List", function(List, Moonlander, Backbone, Marionette, $, _) {
      List.DeployToNewDomain = Marionette.ItemView.extend({

        template: DeployToNewDomainTpl,

        modelEvents: {
          'change': 'render'
        },

        className: "bs-component btn-group ml15",

        onBeforeRender: function() {

        }

      });
    });
    return Moonlander.LandersApp.Landers.List.DeployToNewDomain;
  });