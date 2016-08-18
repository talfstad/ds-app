define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/landers/dao/active_campaign_collection",
    "assets/js/jobs/jobs_app"
  ],
  function(Landerds, JobsGuiBaseModel, ActiveCampaignCollection) {
    var deployedDomainModel = JobsGuiBaseModel.extend({

      url: '/api/deployed_domain',

      initialize: function() {
        var me = this;
        //call base class init
        JobsGuiBaseModel.prototype.initialize.apply(this);

        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        //set initial deploy status
        var setDeployStatusForDomain = function() {
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
              } else if (job.get("deploy_status") == "undeploy_invalidating"){
                deployStatus = "undeploy_invalidating";
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

        activeJobsCollection.on("updateJobModel", function(jobModelAttributes) {

          me.set("deploy_status", jobModelAttributes.deploy_status);

          //check for pagespeed and update them if we have them
          var pagespeedArr = jobModelAttributes.extra.pagespeed;
          if (pagespeedArr) {
            //update the endpoints pagespeed scores !
            var urlEndpointCollection = me.get("urlEndpoints");
            //update the urlEndpoints pagespeed scores

            $.each(pagespeedArr, function(idx, item) {

              //get url endpoint
              urlEndpointCollection.each(function(endpoint) {
                if (endpoint.get("filename") == item.filename) {
                  //update this endpoint's pagespeed score
                  endpoint.set({
                    original_pagespeed: item.original_pagespeed,
                    optimized_pagespeed: item.optimized_pagespeed
                  });
                }
              });
            });

            //trigger a changed_pagespeed
            me.trigger("changed_pagespeed");
          }


        });

        activeJobsCollection.on("startState", function(attr) {
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

          me.set("deploy_status", deployStatus);


        });

        activeJobsCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "undeployDomainFromLander" ||
            jobModel.get("action") === "undeployLanderFromDomain" ||
            jobModel.get("alternate_action") === "undeployDomainFromLander") {
            
            Landerds.updater.remove(jobModel);

            delete jobModel.attributes.id;
            jobModel.destroy();

            Landerds.trigger("list:removeDeployedDomainModelFromCollection", me);

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
        //should default true since deployed_domains is where this model is used
        deploy_status: 'deployed',
        hasActiveCampaigns: false,
        modified: false,
        endpoint_load_times: [],
      }


    });

    return deployedDomainModel;

  });
