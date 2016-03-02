define(["app"],
  function(Moonlander) {
    var ActiveCampaignModel = Backbone.Model.extend({
      
      urlRoot: "/api/active_campaigns_on_domain",

      defaults: {
        name: "",
        active_campaigns_count: 0,
        active_landers_count: 0,
        currentDomains: []

      },

    });
    return ActiveCampaignModel;
  });
