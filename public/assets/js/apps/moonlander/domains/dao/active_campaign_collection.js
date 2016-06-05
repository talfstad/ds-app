define(["app",
		"assets/js/apps/moonlander/domains/dao/active_campaign_model"], 
function(Moonlander, ActiveCampaignModel) {
  
  var ActiveCampaignCollection = Backbone.Collection.extend({
    model: ActiveCampaignModel,
  });


  return ActiveCampaignCollection;
});
