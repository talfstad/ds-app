define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/jobs/jobs_app"
  ],
  function(Landerds, JobsGuiBaseModel) {
    var DeployedLanderModel = JobsGuiBaseModel.extend({

      urlRoot: '/api/active_groups_on_lander',

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
              deployStatus = job.get("deploy_status");
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

          var deployStatus = actualAddedJobModel.get("deploy_status");

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
            
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            //destroy only if we dont have any other jobs for this
            //1. if we have a deploy to do
            var moreJobsToDo = false;
            if(activeJobsCollection.length > 0){              
                moreJobsToDo = true;
            }

            setDeployStatusForDeployedLander();

            if (!moreJobsToDo) {
              //triggers destroy to the server to get rid of this lander from group
              me.destroy();
            }
          } else {

            //finished with this job so destroy the jobModel
            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

          
          }

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobsCollection);

        });

        this.startActiveJobs();

      },

      defaults: {
        domain: "",
        nameservers: "",

        //gui attributes
        //should default true since domains is where this model is used
        deploy_status: 'not_deployed',
      }


    });

    return DeployedLanderModel;

  });

