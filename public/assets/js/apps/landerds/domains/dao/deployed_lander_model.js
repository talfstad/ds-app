define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/domains/dao/active_campaign_collection",
    "assets/js/apps/landerds/base_classes/deployed_rows/models/deployed_row_base_model",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection",
    "assets/js/apps/landerds/landers/dao/deployed_domain_collection",
    "assets/js/jobs/jobs_app"
  ],
  function(Landerds, JobsGuiBaseModel, ActiveCampaignCollection, DeployedRowBaseModel,
    UrlEndpointCollection, DeployedDomainCollection) {
    var DeployedLanderModel = DeployedRowBaseModel.extend({

      url: '/api/deployed_domain',

      initialize: function(models, options) {
        if (options) {
          if (options.url) {
            this.url = function() {
              return options.url + '/' + this.get("id");
            };
          }
        }

        var me = this;
        //call base class init
        DeployedRowBaseModel.prototype.initialize.apply(this);


        var urlEndpointCollection = this.get("urlEndpoints");
        if (Array.isArray(urlEndpointCollection)) {
          urlEndpointCollection = new UrlEndpointCollection(urlEndpointCollection);
          this.set("urlEndpoints", urlEndpointCollection);
        }

        var deployedDomainCollection = this.get("deployedDomains");
        if (Array.isArray(deployedDomainCollection)) {
          deployedDomainCollection = new DeployedDomainCollection(deployedDomainCollection);
          this.set("deployedDomains", deployedDomainCollection);
        }

        //when job is destroyed must look to see if there are any more
        var activeJobCollection = this.get("activeJobs");

        activeJobCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobCollection.on("updateJobModel", function(jobModelAttributes) {
          me.updateBaseJobModel(jobModelAttributes);
        });

        activeJobCollection.on("startState", function(attr) {
          me.setBaseModelStartState(attr);
        });

        activeJobCollection.on("finishedState", function(jobModel) {
          me.baseModelFinishState(jobModel);

          if (jobModel.get("action") == "deployLanderToDomain") {

            //based off deployed domains, however works for deployed landers as well
            //so we leave it as deployedDomains, fix it later if you feel like it
            var deployedDomainsArr = jobModel.get("extra").deployedDomains;
            if (deployedDomainsArr) {

              //get the deployed domain for this domain and set the endpoint load times
              $.each(deployedDomainsArr, function(idx, deployedDomainAttr) {
                if (deployedDomainAttr.domain_id == me.get("domain_id")) {
                  me.set("endpoint_load_times", deployedDomainAttr.endpoint_load_times);
                }
              });
            }
            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

          } else if (jobModel.get("action") === "undeployDomainFromLander" ||
            jobModel.get("action") === "undeployLanderFromDomain" ||
            jobModel.get("alternate_action") === "undeployDomainFromLander") {

            delete jobModel.attributes.id;
            jobModel.destroy();

            //if canceled is set then its a hard cancel for undeploy dont remove the deployed domain model
            //because we're adding another job model right after this cancel
            if (!jobModel.get("canceled")) {
              Landerds.trigger("domains:removeDeployedLanderModelFromCollection", me);
            }

          } else {
            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();
          }

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobCollection);

        });

        this.startActiveJobs();

      },

      defaults: {
        name: "",
        //gui attributes
        //should default true since deployed_domains is where this model is used
        deploy_status: 'deployed',
        hasActiveCampaigns: false,
        modified: false,
        endpoint_load_times: []
      }


    });

    return DeployedLanderModel;

  });
