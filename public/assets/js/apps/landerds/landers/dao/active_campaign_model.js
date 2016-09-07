define(["app",
    "assets/js/apps/landerds/base_classes/deployed_rows/models/deployed_row_base_model"
  ],
  function(Landerds, DeployedRowBaseModel) {
    var ActiveCampaignModel = DeployedRowBaseModel.extend({

      urlRoot: "/api/active_campaigns_on_lander",

      initialize: function() {
        var me = this;
        //call base class init
        DeployedRowBaseModel.prototype.initialize.apply(this);

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
        active_campaigns_count: 0,
        active_landers_count: 0,
        domains: [],
        landers: []
      }

    });
    return ActiveCampaignModel;
  });
