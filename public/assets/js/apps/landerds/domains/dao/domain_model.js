define(["app",
    "assets/js/apps/landerds/domains/dao/deployed_lander_collection",
    "assets/js/apps/landerds/domains/dao/active_group_collection",
    "assets/js/jobs/jobs_base_gui_model"
  ],
  function(Landerds, DeployedLanderCollection, ActiveGroupCollection, JobsGuiBaseModel) {
    var DomainModel = JobsGuiBaseModel.extend({
      urlRoot: "/api/domains",

      //init has 3 steps.
      //1. initialize the activeJobs collection in parent class
      //2. now do stuff for this specific type
      //3. start the jobs from the parent class
      initialize: function() {
        var me = this;

        var activeGroupAttributes = this.get("activeGroups");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLanderCollection = new DeployedLanderCollection(deployedLandersAttributes);
        this.set("deployedLanders", deployedLanderCollection);

        var activeGroupCollection = new ActiveGroupCollection();

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedLanderCollection.on("add change:deploy_status", function(domainModel) {
          me.setDeployStatus();
        });

        this.set("activeGroups", activeGroupCollection);
        activeGroupCollection.add(activeGroupAttributes);



        //now that the domain model is built, init job collection and start jobs
        JobsGuiBaseModel.prototype.initialize.apply(this);


        //on active jobs initialize check if any of them exist and handle start state
        var activeJobCollection = this.get("activeJobs");

        activeJobCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobCollection.on("startState", function() {
          if (activeJobCollection.length > 0) {
            activeJobCollection.each(function(jobModel) {
              if (jobModel.get("action") === "deleteDomain") {
                //adding we're deleting so lets set that deploy_status
                me.set("deploy_status", "deleting");
              }
            });
          }
        });

        activeJobCollection.on("finishedState", function(jobModel) {
          if (jobModel.get("action") === "deleteDomain") {
            //destroy the domain model
            delete me.attributes.id;
            me.destroy();
          }

          //hack to not delete job from server
          delete jobModel.attributes.id;
          jobModel.destroy();


          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobCollection);

        });

        activeJobCollection.on("errorState", function(jobModel) {
          //change deploy status back to deployed
          me.set("deploy_status", "deployed");

          me.trigger("notifyErrorDeleteDomain", jobModel.get("error"));

          //hack to not delete job from server
          delete jobModel.attributes.id;
          jobModel.destroy();

        });

        this.startActiveJobs();

        var addJobsToActiveGroups = function() {
          deployedLanderCollection.each(function(deployedLander) {

            var activeJobCollection = deployedLander.get("activeJobs");

            //if job has group_id also add it to the active group
            if (activeJobCollection.length > 0) {

              activeJobCollection.each(function(activeJob) {

                activeGroupCollection.each(function(activeGroup) {
                  var isOnGroup = false;
                  var landers = activeGroup.get("landers");
                  $.each(landers, function(idx, lander) {
                    if (lander.lander_id == activeJob.get("lander_id")) {
                      isOnGroup = true;
                    }
                  });

                  if (isOnGroup) {
                    var activeGroupActiveJobs = activeGroup.get("activeJobs");
                    activeGroupActiveJobs.add(activeJob);
                  }
                });
              });

            }

          });
        };

        addJobsToActiveGroups();

        activeGroupCollection.on("add destroy", function(activeGroupModel) {
          deployedLanderCollection.trigger("activeGroupsChanged");
        });


        deployedLanderCollection.on("destroy", function(domainModel) {
          me.setDeployStatus();
        });

        this.setDeployStatus();

      },


      setDeployStatus: function() {
        var me = this;

        //set deploy_status based on our new model
        var deployedLanderCollection = this.get("deployedLanders");
        var activeJobCollection = this.get("activeJobs");

        //deployedLander Jobs
        var deployStatus = "not_deployed";
        if (deployedLanderCollection.length > 0) {
          deployStatus = "deployed";
          deployedLanderCollection.each(function(deployedLander) {
            //handles for when we dont have the job added yet (for on save)
            if (deployedLander.get("deploy_status") == "deploying" ||
              deployedLander.get("deploy_status") == "undeploying") {

              //if any are deploying/undeploying thats the wrap
              deployStatus = deployedLander.get("deploy_status");
              return true;

            } else {
              deployedLander.get("activeJobs").each(function(activeJob) {

                if (activeJob.get("action") === "undeployLanderFromDomain") {
                  deployStatus = "undeploying";
                } else if (activeJob.get("action") === "deployLanderToDomain") {
                  deployStatus = "deploying";
                }
              });
            }
          });
        }

        //domain level jobs override deployedLander jobs
        if (activeJobCollection.length > 0) {
          activeJobCollection.each(function(job) {
            if (job.get("action") === "deleteDomain") {
              deployStatus = "deleting";
            } else if (job.get("action") === "newDomain") {
              deployStatus = "initializing";
            }
          });
        }

        me.set("deploy_status", deployStatus);
      },


      defaults: {
        name: "",
        created_on: "",
        deployedLanders: [],
        activeGroups: [],
        deploy_status: "deployed",
        active_groups_count: 0,
        active_landers_count: 0
      }

    });
    return DomainModel;
  });
