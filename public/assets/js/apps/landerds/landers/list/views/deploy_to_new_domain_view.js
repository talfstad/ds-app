define(["app",
    "tpl!assets/js/apps/landerds/landers/list/templates/deploy_to_new_domain.tpl"
  ],
  function(Landerds, DeployToNewDomainTpl) {

    Landerds.module("LandersApp.Landers.List", function(List, Landerds, Backbone, Marionette, $, _) {
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
    return Landerds.LandersApp.Landers.List.DeployToNewDomain;
  });