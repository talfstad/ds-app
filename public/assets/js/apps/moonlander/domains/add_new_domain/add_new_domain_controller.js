define(["app",
    "/assets/js/apps/moonlander/domains/add_new_domain/views/add_new_domain_layout_view.js",
    "/assets/js/jobs/jobs_model.js",
    "/assets/js/apps/moonlander/domains/dao/domain_model.js"
  ],
  function(Moonlander, AddNewDomainLayoutView, JobModel, DomainModel) {
    Moonlander.module("DomainsApp.Domains.AddNewDomain", function(AddNewDomain, Moonlander, Backbone, Marionette, $, _) {

      AddNewDomain.Controller = {

        showAddNewDomainModal: function() {

          //make new lander model for it
          var domainModel = new DomainModel();

          var addNewDomainLayout = new AddNewDomainLayoutView({
            model: domainModel
          });

          addNewDomainLayout.on("confirmAddDomain", function(domainModel) {

            domainModel.save({}, {
              success: function(one, two, three) {

              },
              error: function() {

              }
            });

            //add the domain to the domains list
            // Moonlander.trigger("domains:list:addLander", landerModel);

          });


          addNewDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addNewDomainLayout);

        }

      }
    });

    return Moonlander.DomainsApp.Domains.AddNewDomain.Controller;
  });
