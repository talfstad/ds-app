define(["app",
    "/assets/js/apps/moonlander/domains/delete_domain/views/loading_view.js",
    "/assets/js/apps/moonlander/domains/delete_domain/views/delete_domain_layout_view.js",
  ],
  function(Moonlander, LoadingView, DeleteDomainLayoutView) {
    Moonlander.module("DomainsApp.Domains.DeleteDomain", function(DeleteDomain, Moonlander, Backbone, Marionette, $, _) {

      DeleteDomain.Controller = {

        showDeleteDomainModal: function(model) {

          var deleteDomainLayout = new DeleteDomainLayoutView({
            model: model
          });


          deleteDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(deleteDomainLayout);
         
        }

      }
    });

    return Moonlander.DomainsApp.Domains.DeleteDomain.Controller;
  });
