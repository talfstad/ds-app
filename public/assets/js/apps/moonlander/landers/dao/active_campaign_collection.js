define(["app",
		"/assets/js/apps/moonlander/landers/dao/active_campaign_model.js"], 
function(Moonlander, ActiveCampaignModel) {
  
  var ActiveCampaignCollection = Backbone.Collection.extend({
    model: ActiveCampaignModel,
  });


  return ActiveCampaignCollection;
});