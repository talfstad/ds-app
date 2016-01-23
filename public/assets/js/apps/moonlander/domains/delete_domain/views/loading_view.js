define(["app",
    "tpl!/assets/js/apps/moonlander/domains/delete_domain/templates/loading.tpl"
  ],
  function(Moonlander, DeleteDomainLoadingTpl) {

    Moonlander.module("DomainsApp.DeleteDomain", function(DeleteDomain, Moonlander, Backbone, Marionette, $, _) {
      DeleteDomain.LoadingView = Marionette.ItemView.extend({

        template: DeleteDomainLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Moonlander.DomainsApp.DeleteDomain.LoadingView;
  });