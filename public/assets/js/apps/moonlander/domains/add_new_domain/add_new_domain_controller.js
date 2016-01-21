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

            //show loading
            domainModel.set("alertLoading", true);

            domainModel.save({}, {
              success: function(model, serverResponse, options) {
                //remove loading
                domainModel.set("alertLoading", false);

                if (serverResponse.error) {
                  
                  if (serverResponse.error.code === "couldNotCreateCloudfrontDistribution") {
                    domainModel.set("domainAlreadyAdded", true);
                  } else {
                    //other error
                    
                  }
              
                }


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
