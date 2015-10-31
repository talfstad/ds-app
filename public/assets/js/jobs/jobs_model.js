define(["app"
  ],
  function(Moonlander) {
    var JobsModel = Backbone.Model.extend({

      url: "/api/jobs",

      defaults: {
        "action": "",
        "processing": false,
        "lander_id": "",
        "campaign_id": "",
        "domain_id": ""
      },

    });
    return JobsModel;
  });
