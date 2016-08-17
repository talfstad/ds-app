define(["app"],
  function(Landerds) {

    var JobsModel = Backbone.Model.extend({

      initialize: function() {
        var me = this;
        this.on("updateJobModel", function(jobModelAttributes) {
          me.set("deploy_status", jobModelAttributes.deploy_status);
        });

      },

      url: "/api/jobs",

      defaults: {
        "action": "",
        "processing": false,
        "lander_id": "",
        "campaign_id": "",
        "domain_id": "",
        "lander_url": ""
      },

    });

    return JobsModel;
  });
