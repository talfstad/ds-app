define(["app"], 
function(Moonlander){
var ActiveCampaignModel = Backbone.Model.extend({

  defaults: {
    name: "",
    active_campaigns_count: 0
  },
  
  });
  return ActiveCampaignModel;
});