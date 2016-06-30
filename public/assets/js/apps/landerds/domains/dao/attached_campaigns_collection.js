define(["app",
		"assets/js/apps/landerds/domains/dao/active_campaign_model"], 
function(Landerds, ActiveCampaignModel) {
  
  var AttachedCampaignCollection = Backbone.Collection.extend({
    model: ActiveCampaignModel,
  });


  return AttachedCampaignCollection;
});
