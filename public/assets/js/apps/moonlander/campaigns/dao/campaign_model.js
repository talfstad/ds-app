define(["app",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_lander_collection.js",
    "/assets/js/apps/moonlander/campaigns/dao/deployed_domain_collection.js",
    "/assets/js/jobs/jobs_base_gui_model.js",
    "/assets/js/jobs/jobs_model.js"
  ],
  function(Moonlander, DeployedLanderCollection, DeployedDomainCollection, JobsGuiBaseModel, JobModel) {
    var CampaignModel = JobsGuiBaseModel.extend({
      urlRoot: '/api/campaigns',

      initialize: function() {
        var me = this;

        JobsGuiBaseModel.prototype.initialize.apply(this);
        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        //set deleting deploy status if its deleting
        var setDeployStatusForCampaign = function() {
          if (activeJobsCollection.length > 0) {
            var deployStatus = "deleting";
            me.set("deploy_status", deployStatus);
          } else {
            me.set("deploy_status", "deployed");
          }
        };

        setDeployStatusForCampaign();

        activeJobsCollection.on("add remove", function() {
          setDeployStatusForCampaign();
        });




        //1. build deployedLanders collection - TODO
        var deployedDomainAttributes = this.get("deployedDomains");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLandersCollection = new DeployedLanderCollection(deployedLandersAttributes);

        this.set("deployedLanders", deployedLandersCollection);

        var deployedDomainCollection = new DeployedDomainCollection();

        var applyUpdatedDeployStatusToCampaign = function() {
          //update deploy status view UNLESS we're initializing or deleting. if initializing needs to be changed
          //to not_deployed by the lander job itself because we're adding a new lander. this logic is
          // for when the lander is already added
          if (me.get("deploy_status") !== "initializing" &&
            me.get("deploy_status") !== "deleting") {
            var deployStatus = "deployed";
            deployedLandersCollection.each(function(deployedLanderModel) {
              if (deployedLanderModel.get("activeJobs").length > 0) {
                deployStatus = "deploying";
              } else if (deployedLanderModel.get("deploy_status") === "modified") {
                deployStatus = "modified";
              }
            });

            if (deployStatus !== "deployed") {
              deployedDomainCollection.each(function(deployedDomainModel) {
                if (deployedDomainModel.get("activeJobs").length > 0) {
                  deployStatus = "deploying";
                }
              });
            }

            me.set("deploy_status", deployStatus);
          }
        }

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedLandersCollection.on("add change:deploy_status", function() {
          applyUpdatedDeployStatusToCampaign();
        });

        deployedDomainCollection.on("add change:deploy_status", function() {
          applyUpdatedDeployStatusToCampaign();
        });

        this.set("deployedDomains", deployedDomainCollection);
        deployedDomainCollection.add(deployedDomainAttributes);


        applyUpdatedDeployStatusToCampaign();



        activeJobsCollection.on("startState", function(attr) {
          var actualAddedJobModel = attr.actualAddedJobModel;
          var jobModelToReplace = attr.jobModelToReplace;


          var action = actualAddedJobModel.get("action");
          var deployStatus = "deployed";

          if (action === "deleteCampaign") {
            deployStatus = "deleting";
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


          //create undeploy for each lander for each domain on gui, then when undeploy finishes for deployed lander
          //it will remove the landers_with_campaigns entry from db then when thats all done
          //delete campaigns will see that and call delete campaign and finish job, 
          //which will clean up the campaigns_with_domains

          var deployedLandersCollection = me.get("deployedLanders");
          var deployedDomainsCollection = me.get("deployedDomains");

          deployedLandersCollection.each(function(deployedLander) {

            var deployedLanderActiveJobs = deployedLander.get("activeJobs");

            deployedDomainsCollection.each(function(deployedDomain) {

              var deployedDomainActiveJobs = deployedDomain.get("activeJobs");

              var domain_id = deployedDomain.get("domain_id");
              var lander_id = deployedLander.get("lander_id");
              var campaign_id = me.get("id");
              var action = "undeployLanderFromDomain";

              //check to see if we need to make a job
              var jobAlreadyAdded = false;
              deployedDomainActiveJobs.each(function(activeJob) {
                if (activeJob.get("domain_id") == domain_id &&
                  activeJob.get("campaign_id") == campaign_id &&
                    activeJob.get("lander_id") == lander_id &&
                    activeJob.get("action") == action) {
                  jobAlreadyAdded = true;
                }
              });

              if (!jobAlreadyAdded) {
                var jobAttributes = {
                  'domain_id': domain_id,
                  'lander_id': lander_id,
                  'campaign_id': campaign_id,
                  'action': action
                };

                var jobModel = new JobModel(jobAttributes);

                deployedLanderActiveJobs.add(jobModel);
                deployedDomainActiveJobs.add(jobModel);

                Moonlander.trigger("job:start", jobModel);
              }
            });
          });

        });

        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "deleteCampaign") {

            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            //destroy only if we dont have any other jobs for this
            //1. if we have a deploy to do
            var moreJobsToDo = false;
            if (activeJobsCollection.length > 0) {
              moreJobsToDo = true;
            }

            setDeployStatusForCampaign();

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


      },

      defaults: {
        name: "",
        created_on: "",
        deployedLanders: [],
        deployedDomains: [],
        deploy_status: "deployed",
        deployed_domains_count: 0,
        deployed_landers_count: 0
      }


    });

    return CampaignModel;

  });
