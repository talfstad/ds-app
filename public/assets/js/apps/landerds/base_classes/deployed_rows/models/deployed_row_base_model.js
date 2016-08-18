define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/jobs/jobs_app"
  ],
  function(Landerds, JobsGuiBaseModel) {
    var deployedRowBaseModel = JobsGuiBaseModel.extend({

      url: '/api/deployed_domain',

      updateBaseJobModel: function(jobModelAttributes) {
        this.set("deploy_status", jobModelAttributes.deploy_status);
      },

      setBaseModelStartState: function(attr) {
        var activeJobsCollection = this.get("activeJobs");

        var actualAddedJobModel = attr.actualAddedJobModel;
        var jobModelToReplace = attr.jobModelToReplace;

        //on start remove the created job model and replace with the job model on the updater.
        //this allows us to have one job model across multiple things. (camps, domains, etc)
        //no events should fire it should just be quick and dirty ;)
        //must remove it at the correct index and put the new one in the correct index
        if (jobModelToReplace) {
          var index = activeJobsCollection.indexOf(jobModelToReplace);
          activeJobsCollection.remove(jobModelToReplace, { silent: true })
          activeJobsCollection.add(actualAddedJobModel, { at: index, silent: true });
        }

        var action = actualAddedJobModel.get("action");
        var jobDeployStatus = actualAddedJobModel.get("deploy_status");

        deployStatus = jobDeployStatus

        this.set("deploy_status", deployStatus);
      },

      setDeployStatus: function() {
        var activeJobsCollection = this.get("activeJobs");

        if (activeJobsCollection.length > 0) {
          var deployStatus = "deployed";
          activeJobsCollection.each(function(job) {
            if (job.get("deploy_status") === "invalidating") {
              deployStatus = "invalidating";
              return false;
            } else if (job.get("deploy_status") === "undeploying") {
              deployStatus = "undeploying";
              return false;
            } else if (job.get("deploy_status") == "deploying") {
              deployStatus = "deploying";
              return false;
            } else if (job.get("deploy_status") == "undeploy_invalidating") {
              deployStatus = "undeploy_invalidating";
            }
          });
          this.set("deploy_status", deployStatus);
        } else {
          this.set("deploy_status", "deployed");
        }
      },

      baseModelFinishState: function(jobModel) {

      },

      initialize: function() {
        //call base class init
        JobsGuiBaseModel.prototype.initialize.apply(this);

        this.setDeployStatus();
      },

      defaults: {
        domain: "",
        nameservers: "",
        //gui attributes
        //should default true since deployed_domains is where this model is used
        deploy_status: 'deployed',
        hasActiveCampaigns: false,
        modified: false,
        endpoint_load_times: [],
      }


    });

    return deployedRowBaseModel;

  });
