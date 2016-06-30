define(["app",
    "tpl!assets/js/apps/landerds/domains/delete_domain/templates/loading.tpl"
  ],
  function(Landerds, DeleteDomainLoadingTpl) {

    Landerds.module("DomainsApp.DeleteDomain", function(DeleteDomain, Landerds, Backbone, Marionette, $, _) {
      DeleteDomain.LoadingView = Marionette.ItemView.extend({

        template: DeleteDomainLoadingTpl,

        onRender: function() {

        }

      });
    });
    return Landerds.DomainsApp.DeleteDomain.LoadingView;
  });