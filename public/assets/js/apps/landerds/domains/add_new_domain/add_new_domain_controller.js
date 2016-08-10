define(["app",
    "assets/js/apps/landerds/domains/add_new_domain/views/add_new_domain_layout_view",
    "assets/js/jobs/jobs_model",
    "assets/js/apps/landerds/domains/dao/domain_model"
  ],
  function(Landerds, AddNewDomainLayoutView, JobModel, DomainModel) {
    Landerds.module("DomainsApp.Domains.AddNewDomain", function(AddNewDomain, Landerds, Backbone, Marionette, $, _) {

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
                  Landerds.trigger("domains:list:addDomain", savedDomainModel);
                }
                domainModel.set("alertLoading", false);
                

              },
              error: function() {

              }
            });
          });


          addNewDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(addNewDomainLayout);

        }

      }
    });

    return Landerds.DomainsApp.Domains.AddNewDomain.Controller;
  });
