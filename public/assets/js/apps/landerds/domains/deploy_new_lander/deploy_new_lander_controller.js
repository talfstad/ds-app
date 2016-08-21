define(["app",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/loading_view",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/landers_list_view",
    "assets/js/apps/landerds/domains/deploy_new_lander/views/deploy_new_lander_layout_view",
    "assets/js/apps/landerds/domains/dao/deployed_lander_model",
    "assets/js/apps/landerds/landers/dao/deployed_domain_model",
    "assets/js/apps/landerds/landers/dao/lander_collection"
  ],
  function(Landerds, LoadingView, LandersListView, DeployLanderLayoutView, DeployedLanderModel, DeployedDomainModel) {
    Landerds.module("DomainsApp.Domains.DeployNewLander", function(DeployNewLander, Landerds, Backbone, Marionette, $, _) {

      DeployNewLander.Controller = {

        showDeployNewLander: function(domainModel) {

          var deployLanderToDomainLayout = new DeployLanderLayoutView({
            model: domainModel
          });

          deployLanderToDomainLayout.render();

          Landerds.rootRegion.currentView.modalRegion.show(deployLanderToDomainLayout);

          //show loading
          var loadingView = new LoadingView();
          deployLanderToDomainLayout.landersListRegion.show(loadingView);


          deployLanderToDomainLayout.on("startDeployingNewLander", function(landerModel) {
            // //  1. add the deployed domain to the lander
            // var deployedDomainAttr = {
            //   domain: domainModel.get("domain"),
            //   domain_id: domainModel.get("id"),
            //   lander_id: landerModel.get("id"),
            //   activeJobs: [],
            //   endpoint_load_times: []
            // };

            // var newDeployedDomain = new DeployedDomainModel(deployedDomainAttr);
            // var deployedDomains = landerModel.get("deployedDomains");
            // deployedDomains.add(newDeployedDomain);


            //  2. add the deployed lander to the domains list
            var landerModelUrlEndpoints = landerModel.get("urlEndpoints");
            var urlEndpoints = [];
            landerModelUrlEndpoints.each(function(urlEndpoint) {
              urlEndpoints.push({
                filename: urlEndpoint.get("filename"),
                lander_id: urlEndpoint.get("lander_id"),
                id: urlEndpoint.get("id")
              });
            });

            var deployedLanderAttributes = {
              "lander_id": landerModel.get("id"),
              "name": landerModel.get("name"),
              "deployment_folder_name": landerModel.get("deployment_folder_name"),
              "modified": landerModel.get("modified"),
              "domain_id": domainModel.get("id"),
              "urlEndpoints": urlEndpoints,
              "activeJobs": [],
              "endpoint_load_times": []
            };

            //add the row to deployed landers
            var newDeployedLanderModel = new DeployedLanderModel(deployedLanderAttributes);

            var deployedLanders = domainModel.get("deployedLanders");
            deployedLanders.add(newDeployedLanderModel);


            var domainListToDeploy = [{
              lander_id: landerModel.get("id"),
              domain_id: domainModel.get("id"),
              domain: domainModel.get("domain")
            }];

            var attrs = {
              landerModel: landerModel,
              domainListToDeploy: domainListToDeploy
            }

            // triggers add row to deployed domains and starts job 
            Landerds.trigger("domains:deployNewLander", attrs);


          });


          var deferredLandersCollection = Landerds.request("landers:landersCollection");

          $.when(deferredLandersCollection).done(function(landersCollection) {

            //filter this collection, take out domains that lander is already deployed to
            var filteredLandersCollection = landersCollection.filterOutLanders(domainModel.get("deployedLanders"));

            //create the view, pass collection in as a var to be used to dynamically add to DT
            //show dt in view
            var landersListView = new LandersListView({
              datatablesCollection: filteredLandersCollection
            });


            //show actual view
            deployLanderToDomainLayout.landersListRegion.show(landersListView)


          });


        }

      }
    });

    return Landerds.DomainsApp.Domains.DeployNewLander.Controller;
  });
