define(["app",
    "assets/js/apps/landerds/jobs/jobs_base_gui_model",
    "assets/js/apps/landerds/domains/dao/domain_collection",
    "assets/js/apps/landerds/landers/dao/url_endpoint_collection",
    "assets/js/apps/landerds/landers/dao/deployed_domain_collection",
    "assets/js/apps/landerds/landers/dao/active_group_collection"
  ],
  function(Landerds, JobsGuiBaseModel, DomainCollection, UrlEndpointCollection,
    DeployedDomainsCollection, ActiveGroupCollection) {
    var LanderModel = JobsGuiBaseModel.extend({

      urlRoot: function() {
        if (this.get("ripError") || this.get("addError")) {
          var addError = this.get("addError");
          if (addError.save) {
            return "/api/landers/error/save";
          } else {
            return "/api/landers/error";
          }
        } else if (this.get("reported_broken")) {
          return "/api/landers/report"
        } else {
          return "/api/landers";
        }
      },

      landerNotesModel: null,
      landerNameModel: null,

      initialize: function() {
        var landerNotesModelClass = Backbone.Model.extend({
          urlRoot: "/api/landers/notes"
        });
        var landerNameModelClass = Backbone.Model.extend({
          urlRoot: "/api/landers/name"
        });

        this.landerNotesModel = new landerNotesModelClass({
          id: this.get("id")
        });

        this.landerNameModel = new landerNameModelClass({
          id: this.get("id")
        });

        var me = this;

        this.set("originalValueOptimized", this.get("optimized"));
        this.set("originalValueDeploymentFolderName", this.get("deployment_folder_name"));
        this.set("originalValueDeployRoot", this.get("deploy_root"));
        this.set("originalActiveSnippets", this.get("activeSnippets"));

        var activeGroupAttributes = this.get("activeGroups");
        var urlEndpointAttributes = this.get("urlEndpoints");
        var deployedDomainAttributes = this.get("deployedDomains");

        var deployedDomainsCollection = new DeployedDomainsCollection(deployedDomainAttributes);
        //extra things it needs
        deployedDomainsCollection.urlEndpoints = urlEndpointAttributes;
        deployedDomainsCollection.landerName = this.get("name");

        //whenever deployed domain coll updates deploy_status, update master lander deploy status
        deployedDomainsCollection.on("add change:deploy_status", function(deployedDomainModel) {
          me.setDeployStatus();
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

        var activeGroupCollection = new ActiveGroupCollection();
        this.set("activeGroups", activeGroupCollection);
        activeGroupCollection.add(activeGroupAttributes);



        //when lander changes its deploy status update the topbar totals
        this.on("change:deploy_status", function() {
          Landerds.trigger("landers:updateTopbarTotals");

          var deployStatus = this.get("deploy_status");
          deployedDomainsCollection.deploy_status = deployStatus;
          activeGroupCollection.deploy_status = deployStatus;

        });


        // - init the jobs now that the model is built

        JobsGuiBaseModel.prototype.initialize.apply(this);

        var me = this;

        //on active jobs initialize check if any of them exist and handle start state
        var activeJobCollection = this.get("activeJobs");

        //this is for lander level jobs !
        activeJobCollection.on("updateJobModel", function(jobModelAttributes) {
          me.setDeployStatus();
        });

        activeJobCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobCollection.on("startState", function(attr) {

          if (activeJobCollection.length > 0) {
            activeJobCollection.each(function(jobModel) {
              if (jobModel.get("action") === "ripLander") {
                me.set("deploy_status", jobModel.get("deploy_status"));
              } else if (jobModel.get("action") === "deleteLander") {
                me.set("deploy_status", "deleting");
              } else if (jobModel.get("action") == "savingLander") {
                me.set("saving_lander", true);
              } else if (jobModel.get("action") == "addLander") {
                me.set("deploy_status", jobModel.get("deploy_status"));
              } else {
                me.set("deploy_status", "deploying");
              }
            });
          }
        });

        activeJobCollection.on("errorState", function(jobModel, updaterResponse) {
          if (jobModel.get("error") == "UserReportedInterrupt" ||
            jobModel.get("error") == "TimeoutInterrupt" ||
            jobModel.get("error") == "ExternalInterrupt") {
            delete me.attributes.id;
            me.destroy();
          }
        });

        activeJobCollection.on("finishedState", function(jobModel, updaterResponse) {

          if (jobModel.get("action") === "ripLander" || jobModel.get("action") === "addLander") {

            if (updaterResponse.extra.new_lander) {
              var newLanderData = updaterResponse.extra.new_lander;

              me.set("s3_folder_name", newLanderData.s3_folder_name);
              me.set("deployment_folder_name", newLanderData.s3_folder_name);

              var urlEndpoints = me.get("urlEndpoints");
              urlEndpoints.add(newLanderData.urlEndpoints);
            }

            //update lander status to not deployed
            me.set("deploy_status", "not_deployed");
            me.trigger("landerFinishAdded", me); //for gui to know its time to update

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

          delete jobModel.attributes.id;
          jobModel.destroy();

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobCollection);

        });

        this.startActiveJobs();

        var addJobsToActiveGroups = function() {
          deployedDomainsCollection.each(function(deployedDomain) {

            var activeJobCollection = deployedDomain.get("activeJobs");

            //if job has group_id also add it to the active group
            if (activeJobCollection.length > 0) {

              activeJobCollection.each(function(activeJob) {

                activeGroupCollection.each(function(activeGroup) {
                  var isOnGroup = false;
                  var domains = activeGroup.get("domains");
                  domains.each(function(domain) {
                    if (domain.get("domain_id") == activeJob.get("domain_id")) {
                      isOnGroup = true;
                    }
                  });

                  if (isOnGroup) {
                    activeGroupActiveJobs = activeGroup.get("activeJobs");
                    activeGroupActiveJobs.add(activeJob);
                  }
                });
              });
            }
          });
        };

        addJobsToActiveGroups();

        activeGroupCollection.on("add destroy", function(activeGroupModel) {
          deployedDomainsCollection.trigger("activeGroupsChanged");
        });

        deployedDomainsCollection.on("destroy", function(domainModel) {
          me.setDeployStatus();
        });

        this.setDeployStatus();
      },

      saveName: function(callback) {
        var me = this;
        var newLanderName = this.get("name");
        this.landerNameModel.set("name", newLanderName);
        this.landerNameModel.save({}, {
          success: function(model) {
            if (typeof callback == 'function') callback();
          }
        });
      },

      saveNotes: function(callback) {
        var me = this;
        this.landerNotesModel.set("notes", this.get("notes"));
        this.landerNotesModel.set("notes_search", this.get("notes_search"));
        this.landerNotesModel.save({}, {
          success: function(model) {
            me.set("server_notes", me.get("notes"));
            if (typeof callback == 'function') callback();
          }
        });
      },

      getNotes: function() {
        var me = this;
        this.landerNotesModel.fetch({
          success: function(model) {
            me.set("notes", model.get("notes"));
            me.set("server_notes", model.get("notes"));
            me.trigger("setNotesInEditor");
          }
        });
      },

      setDeployStatus: function() {
        var me = this;

        //set deploy_status based on our new model
        var deployedDomainCollection = this.get("deployedDomains");
        var activeJobCollection = this.get("activeJobs");

        //deployedDomain Jobs
        var isSaving = false;
        var deployStatus = "not_deployed";
        if (deployedDomainCollection.length > 0) {
          deployStatus = "deployed";
          deployedDomainCollection.each(function(deployedDomain) {

            //handles for when we dont have the job added yet (for on save)
            if (deployedDomain.get("deploy_status") == "deploying" ||
              deployedDomain.get("deploy_status") == "undeploying") {

              //if any are deploying/undeploying thats the wrap
              deployStatus = deployedDomain.get("deploy_status");
              return true;

            } else {

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
            }
          });

          //set saving
          me.set("saving_lander", isSaving);

        }

        //lander level jobs override deployedDomain jobs
        if (activeJobCollection.length > 0) {
          activeJobCollection.each(function(job) {
            if (job.get("action") === "deleteLander") {
              deployStatus = "deleting";
            } else if (job.get("action") === "addLander") {
              deployStatus = job.get("deploy_status");
            } else if (job.get("action") === "ripLander") {
              deployStatus = job.get("deploy_status");
            }
          });
        }

        me.set("deploy_status", deployStatus);

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
        activeGroups: [],
        no_optimize_on_save: true,
        deploymentFolderInvalid: false,
        reported_broken: false,
        //gui update attributes
        deploy_status: 'not_deployed',
        deploy_status_gui: 'Working',
        totalNumJsSnippets: 0,
        deployment_folder_name: "",
        ripped_from: false,
        s3_folder_name: "",
        modified: false,
        deployed_domains_count: 0,
        active_groups_count: 0,
        currentPreviewEndpointId: 0,
        saving_lander: false
      }

    });
    return LanderModel;
  });
