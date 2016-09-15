define(["app",
    "assets/js/apps/landerds/base_classes/deployed_rows/models/deployed_row_base_model",
    "assets/js/apps/landerds/groups/dao/domain_list_collection"
  ],
  function(Landerds, DeployedRowBaseModel, DomainListCollection) {
    var ActiveGroupsModel = DeployedRowBaseModel.extend({

      urlRoot: "/api/active_groups_on_lander",

      initialize: function() {
        var me = this;
        //call base class init
        DeployedRowBaseModel.prototype.initialize.apply(this);

        //create collection only if we didnt initiate using a collection
        var domainListAttributes = this.get("domains");
        if (Array.isArray(domainListAttributes)) {
          var domainListCollection = new DomainListCollection(domainListAttributes);
          this.set("domains", domainListCollection);

        }

        //when job is destroyed must look to see if there are any more
        var activeJobsCollection = this.get("activeJobs");

        activeJobsCollection.on("add remove", function() {
          me.setDeployStatus();
        });

        activeJobsCollection.on("startState", function(attr) {
          me.setBaseModelStartState(attr);
        });

        activeJobsCollection.on("finishedState", function(jobModel) {
          me.baseModelFinishState(jobModel);
        });

        this.startActiveJobs();

      },

      defaults: {
        name: "",
        active_groups_count: 0,
        active_landers_count: 0,
        domains: [],
        landers: []
      }

    });
    return ActiveGroupsModel;
  });
