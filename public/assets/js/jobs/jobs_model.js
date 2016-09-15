define(["app"],
  function(Landerds) {

    var JobsModel = Backbone.Model.extend({

      initialize: function() {
        var me = this;

        //needed to keep the job models deployment status updated, used in
        //server to figure out if the deployment status has "changed" which
        //triggers extra data to be added to the return object in some cases
        this.on("updateJobModel", function(jobModelAttributes) {
          me.set("deploy_status", jobModelAttributes.deploy_status);
        });

      },

      url: "/api/jobs",

      defaults: {
        "action": "",
        "processing": false,
        "lander_id": "",
        "group_id": "",
        "domain_id": "",
        "lander_url": "",
        "extra": {},
        "no_action_on_finish": false
      },

    });

    return JobsModel;
  });
