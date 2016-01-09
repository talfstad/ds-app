define(["app",
    "tpl!/assets/js/apps/moonlander/domains/list/templates/deploy_to_new_domain.tpl"
  ],
  function(Moonlander, DeployToNewDomainTpl) {

    Moonlander.module("DomainsApp.Domains.List", function(List, Moonlander, Backbone, Marionette, $, _) {
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
    return Moonlander.DomainsApp.Domains.List.DeployToNewDomain;
  });