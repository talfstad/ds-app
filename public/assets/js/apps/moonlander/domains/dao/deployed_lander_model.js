define(["app",
    "/assets/js/jobs/jobs_base_gui_model.js",
    "/assets/js/apps/moonlander/domains/dao/attached_campaigns_collection.js",
    "/assets/js/jobs/jobs_app.js"
  ],
  function(Moonlander, JobsGuiBaseModel, AttachedCampaignsCollection) {
    var DeployedLanderModel = JobsGuiBaseModel.extend({

      url: '/',

      initialize: function() {
        var me = this;
        //call base class init
        JobsGuiBaseModel.prototype.initialize.apply(this);

        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        //set initial deploy status
        var setDeployStatusForDeployedLander = function() {
          if (activeJobsCollection.length > 0) {
            var deployStatus = "deployed";
            activeJobsCollection.each(function(job) {
              if (job.get("action") === "undeployLanderFromDomain") {
                deployStatus = "undeploying";
              } else if (job.get("action") === "deployLanderToDomain") {
                deployStatus = "deploying";
              }
            });
            me.set("deploy_status", deployStatus);
          } else {
            me.set("deploy_status", "deployed");
          }
        };

        setDeployStatusForDeployedLander();

        activeJobsCollection.on("add remove", function() {
          setDeployStatusForDeployedLander();
        });

        activeJobsCollection.on("startState", function(attr) {
          var actualAddedJobModel = attr.actualAddedJobModel;
          var jobModelToReplace = attr.jobModelToReplace;

          var action = actualAddedJobModel.get("action");
          var deployStatus = "deployed";

          if (action === "undeployLanderFromDomain") {
            deployStatus = "undeploying";
          } else if (action === "deployLanderToDomain") {
            deployStatus = "deploying";
          }

          me.set("deploy_status", deployStatus);

          //on start remove the created job model and replace with the job model on the updater.
          //this allows us to have one job model across multiple things. (camps, domains, etc)
          //no events should fire it should just be quick and dirty ;)
          //must remove it at the correct index and put the new one in the correct index
          if (jobModelToReplace) {
            var index = activeJobsCollection.indexOf(jobModelToReplace);
            activeJobsCollection.remove(jobModelToReplace, {silent: true})
            activeJobsCollection.add(actualAddedJobModel, {at: index, silent: true});
          }

        });

        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "undeployLanderFromDomain") {
            //destroy only if we dont have any other jobs for this
            //1. if we have a deploy to do
            var moreJobsToDo = false;
            activeJobsCollection.each(function(job) {
              if (job.get("action") == "deployLanderToDomain") {
                moreJobsToDo = true;
              }
            });

            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            setDeployStatusForDeployedLander();

            if (!moreJobsToDo) {
              me.trigger('destroy', me, me.collection);
            }
          } else if (jobModel.get("action") === "deployLanderToDomain") {

            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            if (me.get("shouldSetModifiedWhenJobsFinish")) {
              me.set("deploy_status", "modified");
            } else {
              me.set("deploy_status", "deployed");
            }
          }

          //trigger to start the next job on the list
          Moonlander.trigger("job:startNext", activeJobsCollection);

        });


        //build attachedCampaigns collection
        var attachedCampaignsCollection = new AttachedCampaignsCollection();
        this.set("attachedCampaigns", attachedCampaignsCollection);

        this.startActiveJobs();

      },

      defaults: {
        domain: "",
        nameservers: "",

        //gui attributes
        //should default true since deployed_domains is where this model is used
        deploy_status: 'deployed',
        attachedCampaigns: []
      }


    });

    return DeployedLanderModel;

  });
