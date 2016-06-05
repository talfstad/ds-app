define(["app",
    "assets/js/apps/moonlander/domains/add_new_domain/views/add_new_domain_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/moonlander/domains/dao/domain_model"
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
              success: function(savedDomainModel, serverResponse, options) {
                //remove loading
                domainModel.set("alertLoading", false);

                if (serverResponse.error) {
                  
                  if (serverResponse.error.code === "couldNotCreateCloudfrontDistribution") {
                    domainModel.set("domainAlreadyAdded", true);
                  } else if (serverResponse.error.code === "DomainInvalid") {
                    domainModel.set("domainInvalid", true);
                  } else {
                    //other error
                    domainModel.set("errorCode", serverResponse.error.code);
                    domainModel.set("alertUnknownError", true);
                  }
                } else {
                  //successfully saved new domain
                  addNewDomainLayout.onClose();

                  //now add it to the collection
                  Moonlander.trigger("domains:list:addDomain", savedDomainModel);
                }


              },
              error: function() {

              }
            });
          });


          addNewDomainLayout.render();

          Moonlander.rootRegion.currentView.modalRegion.show(addNewDomainLayout);

        }

      }
    });

    return Moonlander.DomainsApp.Domains.AddNewDomain.Controller;
  });
