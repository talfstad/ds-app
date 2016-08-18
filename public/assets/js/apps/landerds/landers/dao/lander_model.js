define(["app",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection",
    "assets/js/apps/landerds/landers/dao/deployed_domain_collection",
    "assets/js/apps/landerds/landers/dao/active_campaign_collection"
  ],
  function(Landerds, JobsGuiBaseModel, DomainCollection, UrlEndpointCollection,
    DeployedDomainsCollection, ActiveCampaignCollection) {
    var LanderModel = JobsGuiBaseModel.extend({
      urlRoot: "/api/landers",


      //init has 3 steps.
      //1. initialize the activeJobs collection in parent class
      //2. now do stuff for this specific type
      //3. start the jobs from the parent class
      initialize: function() {
        JobsGuiBaseModel.prototype.initialize.apply(this);

        var me = this;

        //on active jobs initialize check if any of them exist and handle start state
        var activeJobsCollection = this.get("activeJobs");


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

          if (activeJobsCollection.length > 0) {
            activeJobsCollection.each(function(jobModel) {
              if (jobModel.get("action") === "addNewLander") {
                //adding new lander so we're still initializing...
                me.set("deploy_status", "initializing");

              } else if (jobModel.get("action") === "ripNewLander") {
                me.set("deploy_status", "initializing");
              } else if (jobModel.get("action") === "deleteLander") {
                me.set("deploy_status", "deleting");
              } else if (jobModel.get("action") == "savingLander") {
                me.set("saving_lander", true);
              } else {
                me.set("deploy_status", "deploying");
              }
            });
          }
        });

        activeJobsCollection.on("finishedState", function(jobModel, updaterResponse) {
          var deployStatus = "deployed";
          if (jobModel.get("action") === "addNewLander" ||
            jobModel.get("action") === "ripNewLander") {
            //update lander status to not deployed
            deployStatus = "not_deployed";
            me.set("deploy_status", deployStatus);
          } else if (jobModel.get("action") === "deleteLander") {
            //destroy the lander model
            delete me.attributes.id;
            me.destroy();
          } else if (jobModel.get("action") === "savingLander") {
            me.set("saving_lander", false);
          }

          //when we finish we have extra data we need to update, and then
          //trigger an update pagespeed score event
          //check for pagespeed and update them if we have them
          if (updaterResponse.extra) {
            var pagespeedArr = updaterResponse.extra.pagespeed;
            if (pagespeedArr) {

              //save finished update no_optimize_on_save to false because
              //no we can quick save again!
              me.set("no_optimize_on_save", true);


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
          }

          Landerds.updater.remove(jobModel);
          delete jobModel.attributes.id;
          jobModel.destroy();

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobsCollection);

        });

        this.startActiveJobs();

        ////////

        //1. build deployedDomains collection
        //2. build urlendpoint collection

        this.set("originalValueOptimized", this.get("optimized"));
        this.set("originalValueDeploymentFolderName", this.get("deployment_folder_name"));
        this.set("originalValueDeployRoot", this.get("deploy_root"));
        this.set("originalActiveSnippets", this.get("activeSnippets"));

        var activeCampaignAttributes = this.get("activeCampaigns");
        var urlEndpointAttributes = this.get("urlEndpoints");
        var deployedDomainAttributes = this.get("deployedDomains");

        var deployedDomainsCollection = new DeployedDomainsCollection(deployedDomainAttributes);
        //extra things it needs
        deployedDomainsCollection.urlEndpoints = urlEndpointAttributes;
        deployedDomainsCollection.landerName = this.get("name");

        var applyUpdatedDeployStatusToLander = function() {
          //update deploy status view UNLESS we're initializing or deleting. if initializing needs to be changed
          //to not_deployed by the lander job itself because we're adding a new lander. this logic is
          // for when the lander is already added

          if (me.get("deploy_status") !== "initializing" &&
            me.get("deploy_status") !== "deleting") {
            var deployStatus = "deployed";
            if (deployedDomainsCollection.length > 0) {
              deployedDomainsCollection.each(function(deployedDomainModel) {
                var activeJobs = deployedDomainModel.get("activeJobs");

                if (activeJobs.length > 0) {
                  deployStatus = "deploying"; //to make lander show "working"
                } else if (deployedDomainModel.get("deploy_status") == "deploying") {
                  deployStatus = "deploying"; //to make lander show "working"
                } else if (deployedDomainModel.get("deploy_status") == "undeploying") {
                  deployStatus = "deploying"; //to make lander show "working"
                }

              });
            } else {
              deployStatus = "deployed"
            }

            me.set("deploy_status", deployStatus);
          }
        };

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedDomainsCollection.on("add change:deploy_status", function(deployedDomainModel) {
          applyUpdatedDeployStatusToLander();
          var deployedDomainDeployStatus = deployedDomainModel.get("deploy_status");

          //saving lander is always set true where it begins save
          if (deployedDomainDeployStatus == "invalidating" ||
            deployedDomainDeployStatus == "deployed") {
            me.set({
              saving_lander: false,
              no_optimize_on_save: true
            });
          }
        });

        //if deployed domain triggers endpoint change then we update the lander
        //endpoint view by triggering this model event
        deployedDomainsCollection.on("changed_pagespeed", function() {
          me.trigger("changed_pagespeed");
        });

        this.set("deployedDomains", deployedDomainsCollection);

        var urlEndpointCollection = new UrlEndpointCollection(urlEndpointAttributes);
        this.set("urlEndpoints", urlEndpointCollection);

        var activeCampaignsCollection = new ActiveCampaignCollection();

        // when adding models to the active campaign collection, make sure that each
        // campaigns current domains is in deployedDomains. if not then trigger a deploy on
        // 
        var deployedDomainsCollection = this.get("deployedDomains");

        this.set("activeCampaigns", activeCampaignsCollection);

        activeCampaignsCollection.add(activeCampaignAttributes);

        //when lander changes its deploy status update the topbar totals
        this.on("change:deploy_status", function() {
          Landerds.trigger("landers:updateTopbarTotals");

          var deployStatus = this.get("deploy_status");
          deployedDomainsCollection.deploy_status = deployStatus;
          activeCampaignsCollection.deploy_status = deployStatus;

        });


        deployedDomainsCollection.on("destroy", function(domainModel) {
          applyUpdatedDeployStatusToLander();
        });


        //set deploy_status based on our new model

        //deployedDomain Jobs
        var isSaving = false;
        var deployStatus = "not_deployed";
        if (deployedDomainsCollection.length > 0) {
          deployStatus = "deployed";
          deployedDomainsCollection.each(function(deployedDomain) {

            deployedDomain.get("activeJobs").each(function(activeJob) {

              if (activeJob.get("action") === "undeployLanderFromDomain") {
                deployStatus = "undeploying";
              } else if (activeJob.get("action") === "deployLanderToDomain") {
                deployStatus = "deploying";
              }

              //check if we're saving
              if (activeJob.get("action") == "deployLanderToDomain") {
                isSaving = true; //default if we have a deploy job
              }

              if (activeJob.get("action") == "deployLanderToDomain" &&
                (activeJob.get("deploy_status") == "deployed" ||
                  activeJob.get("deploy_status") == "invalidating")) {

                //we're not saving!
                isSaving = false;
              }
            });

          });

          //set saving
          me.set("saving_lander", isSaving);

        }



        //lander level jobs override deployedDomain jobs
        if (activeJobsCollection.length > 0) {
          activeJobsCollection.each(function(job) {
            if (job.get("action") === "deletingLander") {
              deployStatus = "deleting";
            } else if (job.get("action") === "addNewLander") {
              deployStatus = "initializing";
            } else if (job.get("action") === "ripNewLander") {
              deployStatus = "initializing";
            }
          });
        }
        this.set("deploy_status", deployStatus);

        if (this.get("modified")) {
          deployedDomainsCollection.each(function(location) {
            location.set("modified", true);
          });
        }

      },

      defaults: {
        id: null,
        name: "",
        created_on: "",
        urlEndpointsJSON: [],
        // optimized: true,
        deploy_root: false,
        urlEndpoints: [],
        deployedDomains: [],
        activeCampaigns: [],
        no_optimize_on_save: true,
        deploymentFolderInvalid: false,
        //gui update attributes
        deploy_status: 'not_deployed',
        totalNumJsSnippets: 0,
        deployment_folder_name: "",
        modified: false,
        deployed_domains_count: 0,
        active_campaigns_count: 0,
        currentPreviewEndpointId: 0,
        saving_lander: false
      }

    });
    return LanderModel;
  });
