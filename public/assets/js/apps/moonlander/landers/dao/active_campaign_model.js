define(["app"],
  function(Moonlander) {
    var ActiveCampaignModel = Backbone.Model.extend({

      url: "/api/active_campaigns",

      defaults: {
        name: "",
        active_campaigns_count: 0,
        currentDomains: []

      },

    });
    return ActiveCampaignModel;
  });
