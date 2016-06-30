define(["app",
    "assets/js/apps/landerds/domains/delete_domain/views/loading_view",
    "assets/js/apps/landerds/domains/delete_domain/views/delete_domain_layout_view",
  ],
  function(Landerds, LoadingView, DeleteDomainLayoutView) {
    Landerds.module("DomainsApp.Domains.DeleteDomain", function(DeleteDomain, Landerds, Backbone, Marionette, $, _) {

      DeleteDomain.Controller = {

        showDeleteDomainModal: function(model) {

          var deleteDomainLayout = new DeleteDomainLayoutView({
            model: model
          });


          deleteDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deleteDomainLayout);
         
        }

      }
    });

    return Landerds.DomainsApp.Domains.DeleteDomain.Controller;
  });
