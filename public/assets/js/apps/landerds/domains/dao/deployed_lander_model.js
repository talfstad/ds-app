define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/domains/dao/active_campaign_collection",
    "assets/js/apps/landerds/base_classes/deployed_rows/models/deployed_row_base_model",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection",
    "assets/js/jobs/jobs_app"
  ],
  function(Landerds, JobsGuiBaseModel, ActiveCampaignCollection, DeployedRowBaseModel, UrlEndpointCollection) {
    var DeployedLanderModel = DeployedRowBaseModel.extend({

      url: '/api/deployed_domain',

      initialize: function() {
        var me = this;
        //call base class init
        DeployedRowBaseModel.prototype.initialize.apply(this);
        

        var urlEndpointAttributes = this.get("urlEndpoints");
        var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
        this.set("urlEndpoints", urlEndpointCollection);


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

          if (jobModel.get("action") === "undeployDomainFromLander" ||
            jobModel.get("action") === "undeployLanderFromDomain" ||
            jobModel.get("alternate_action") === "undeployDomainFromLander") {

            delete jobModel.attributes.id;
            jobModel.destroy();

            //if canceled is set then its a hard cancel for undeploy dont remove the deployed domain model
            //because we're adding another job model right after this cancel
            if (!jobModel.get("canceled")) {
              Landerds.trigger("list:removeDeployedDomainModelFromCollection", me);
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
