define(["app",
    "assets/js/apps/landerds/domains/dao/deployed_lander_collection",
    "assets/js/apps/landerds/campaigns/dao/domain_list_collection",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, DeployedLanderCollection, DomainListCollection, JobsGuiBaseModel, JobModel) {
    var CampaignModel = JobsGuiBaseModel.extend({
      urlRoot: '/api/campaigns',

      initialize: function() {
        var me = this;

        //init deployed landers and domains 
        var domainListAttributes = this.get("domains");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLanderCollection = new DeployedLanderCollection(deployedLandersAttributes);

        this.set("deployedLanders", deployedLanderCollection);

        var domainListCollection = new DomainListCollection(domainListAttributes);
        this.set("domains", domainListCollection);

        JobsGuiBaseModel.prototype.initialize.apply(this);

        //when job is destroyed must look to see if there are any more
        var activeJobCollection = this.get("activeJobs");

        activeJobCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobCollection.on("startState", function(attr) {
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
            var index = activeJobCollection.indexOf(jobModelToReplace);
            activeJobCollection.remove(jobModelToReplace, { silent: true })
            activeJobCollection.add(actualAddedJobModel, { at: index, silent: true });
          }


          //create undeploy for each lander for each domain on gui, then when undeploy finishes for deployed lander
          //it will remove the landers_with_campaigns entry from db then when thats all done
          //delete campaigns will see that and call delete campaign and finish job, 
          //which will clean up the campaigns_with_domains

          deployedLanderCollection.each(function(deployedLander) {

            var deployedLanderActiveJobs = deployedLander.get("activeJobs");

            domainListCollection.each(function(domain) {

              var domainListActiveJobs = domain.get("activeJobs");

              var domain_id = domain.get("domain_id");
              var lander_id = deployedLander.get("lander_id");
              var campaign_id = me.get("id");
              var action = "undeployLanderFromDomain";

              //check to see if we need to make a job
              var jobAlreadyAdded = false;
              domainListActiveJobs.each(function(activeJob) {
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
                  'action': action,
                  'alternate_action': 'undeployDomainFromLander',
                  'deploy_status': 'undeploying'
                };

                var jobModel = new JobModel(jobAttributes);

                deployedLanderActiveJobs.add(jobModel);
                domainListActiveJobs.add(jobModel);

                Landerds.trigger("job:start", jobModel);
              }
            });
          });

        });

        activeJobCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "deleteCampaign") {

            //hack to get it to not send DELETE XHR
            delete jobModel.attributes.id;
            jobModel.destroy();

            //destroy only if we dont have any other jobs for this
            //1. if we have a deploy to do
            var moreJobsToDo = false;
            if (activeJobCollection.length > 0) {
              moreJobsToDo = true;
            }

            setDeployStatusForCampaign();

            if (!moreJobsToDo) {
              me.trigger("notifySuccessDeleteCampaign");

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

        var addJobsToActiveCampaigns = function() {
          deployedLanderCollection.each(function(deployedLander) {

            var activeJobCollection = deployedLander.get("activeJobs");

            //if job has campaign_id also add it to the active campaign
            if (activeJobCollection.length > 0) {

              activeJobCollection.each(function(activeJob) {

                activeCampaignCollection.each(function(activeCampaign) {
                  var isOnCampaign = false;
                  var domains = activeCampaign.get("domains");
                  $.each(domains, function(idx, domain) {
                    if (domain.domain_id == activeJob.get("domain_id")) {
                      isOnCampaign = true;
                    }
                  });

                  if (isOnCampaign) {
                    activeCampaignActiveJobs = activeCampaign.get("activeJobs");
                    activeCampaignActiveJobs.add(activeJob);
                  }
                });
              });

            }

          });
        };

        addJobsToActiveCampaigns();


        domainListCollection.on("add destroy", function(activeCampaignModel) {
          deployedLanderCollection.trigger("domainsChanged");
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
        domains: [],
        deploy_status: "deployed",
        domains_count: 0,
        deployed_landers_count: 0
      }


    });

    return CampaignModel;

  });
