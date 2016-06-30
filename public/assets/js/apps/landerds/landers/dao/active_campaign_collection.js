define(["app",
		"assets/js/apps/landerds/landers/dao/active_campaign_model"], 
function(Landerds, ActiveCampaignModel) {
  
  var ActiveCampaignCollection = Backbone.Collection.extend({
    model: ActiveCampaignModel,
  });


  return ActiveCampaignCollection;
});
