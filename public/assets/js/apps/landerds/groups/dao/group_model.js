define(["app",
    "assets/js/apps/landerds/domains/dao/deployed_lander_collection",
    "assets/js/apps/landerds/groups/dao/domain_list_collection",
    "assets/js/jobs/jobs_base_gui_model",
    "assets/js/jobs/jobs_model"
  ],
  function(Landerds, DeployedLanderCollection, DomainListCollection, JobsGuiBaseModel, JobModel) {
    var GroupModel = JobsGuiBaseModel.extend({
      urlRoot: '/api/groups',

      groupNotesModel: null,

      initialize: function() {
        var me = this;

        var groupNotesModelClass = Backbone.Model.extend({
          urlRoot: "/api/groups/notes"
        });

        this.groupNotesModel = new groupNotesModelClass({
          id: this.get("id")
        });

        //init deployed landers and domains 
        var domainListAttributes = this.get("domains");
        var deployedLandersAttributes = this.get("deployedLanders");

        var deployedLanderCollection = new DeployedLanderCollection(deployedLandersAttributes, {
          url: '/api/active_groups_on_lander'
        });

        this.set("deployedLanders", deployedLanderCollection);

        var domainListCollection = new DomainListCollection(domainListAttributes);
        this.set("domains", domainListCollection);

        //when lander changes its deploy status update the topbar totals
        deployedLanderCollection.on("add change:deploy_status", function(deployedLanderModel) {
          me.setDeployStatus();
        });

        this.on("change:deploy_status", function() {
          Landerds.trigger("landers:updateTopbarTotals");
        });

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

          if (action === "deleteGroup") {
            deployStatus = "deleting";
          }

          me.set("deploy_status", deployStatus);

        });

        activeJobCollection.on("finishedState", function(jobModel) {

          if (jobModel.get("action") === "deleteGroup") {
            //destroy the lander model
            delete me.attributes.id;
            me.destroy();
          }

          //finished with this job so destroy the jobModel
          //hack to get it to not send DELETE XHR
          delete jobModel.attributes.id;
          jobModel.destroy();

          //trigger to start the next job on the list
          Landerds.trigger("job:startNext", activeJobCollection);

        });


        this.startActiveJobs();

        var addJobsToActiveGroups = function() {
          deployedLanderCollection.each(function(deployedLander) {

            var activeJobCollection = deployedLander.get("activeJobs");

            //if job has group_id also add it to the active group
            if (activeJobCollection.length > 0) {

              activeJobCollection.each(function(activeJob) {

                var domains = me.get("domains");
                domains.each(function(domain) {
                  if (domain.get("domain_id") == activeJob.get("domain_id")) {
                    domainActiveJobs = domain.get("activeJobs");
                    domainActiveJobs.add(activeJob);
                  }
                });
              });

            }
          });
        };

        addJobsToActiveGroups();


        domainListCollection.on("add destroy", function(activeGroupModel) {
          deployedLanderCollection.trigger("domainsChanged");
        });

        deployedLanderCollection.on("destroy", function(domainModel) {
          me.setDeployStatus();
        });

        this.setDeployStatus();
      },

      saveNotes: function(callback) {
        var me = this;
        this.groupNotesModel.set("notes", this.get("notes"));
        this.groupNotesModel.set("notes_search", this.get("notes_search"));
        this.groupNotesModel.save({}, {
          success: function(model) {
            me.set("server_notes", me.get("notes"));
            if (typeof callback == 'function') callback();
          }
        });
      },

      getNotes: function() {
        var me = this;
        this.groupNotesModel.fetch({
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

    return GroupModel;

  });
