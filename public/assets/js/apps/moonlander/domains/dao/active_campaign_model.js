define(["app",
    "/assets/js/jobs/jobs_base_gui_model.js"
  ],
  function(Moonlander, JobsGuiBaseModel) {
    var ActiveCampaignModel = JobsGuiBaseModel.extend({

      urlRoot: "/api/active_campaigns_on_domain",

      defaults: {
        name: "",
        active_campaigns_count: 0,
        active_landers_count: 0,
        currentDomains: []
      },

      initialize: function() {
        var me = this;
        //call base class init
        JobsGuiBaseModel.prototype.initialize.apply(this);

        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        //set initial deploy status
        var setDeployStatusForDomain = function() {
          if (activeJobsCollection.length > 0) {
            var deployStatus = "deploying";
            activeJobsCollection.each(function(job) {
              if (job.get("action") === "undeployLanderFromDomain" || job.get("action") === "undeployDomainFromLander") {
                deployStatus = "undeploying";
              }
            });
            me.set("deploy_status", deployStatus);
          } else {
            me.set("deploy_status", "deployed");
          }
        };

        setDeployStatusForDomain();

        activeJobsCollection.on("add remove", function() {
          setDeployStatusForDomain();
        });


        activeJobsCollection.on("startState", function(attr) {
          var actualAddedJobModel = attr.actualAddedJobModel;
          var jobModelToReplace = attr.jobModelToReplace;


          var action = actualAddedJobModel.get("action");
          var deployStatus = "deployed";

          if (action === "undeployLanderFromDomain" || action === "undeployDomainFromLander") {
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
            activeJobsCollection.remove(jobModelToReplace, { silent: true })
            activeJobsCollection.add(actualAddedJobModel, { at: index, silent: true });
          }

        });

        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "undeployDomainFromLander" ||
            jobModel.get("alternate_action") === "undeployDomainFromLander") {

            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            //destroy only if we dont have any other jobs for this
            //1. if we have a deploy to do
            var moreJobsToDo = false;
            if (activeJobsCollection.length > 0) {
              moreJobsToDo = true;
            }

            setDeployStatusForDomain();

            if (!moreJobsToDo) {
              //triggers destroy to the server to get rid of this lander from campaign
              me.destroy();
            }
          } else {

            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();
          }

          //trigger to start the next job on the list
          Moonlander.trigger("job:startNext", activeJobsCollection);

        });


        this.startActiveJobs();

      }



    });
    return ActiveCampaignModel;
  });
