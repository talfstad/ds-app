define(["app",
		"/assets/js/apps/moonlander/domains/dao/active_campaign_model.js"], 
function(Moonlander, ActiveCampaignModel) {
  
  var AttachedCampaignCollection = Backbone.Collection.extend({
    model: ActiveCampaignModel,
  });


  return AttachedCampaignCollection;
});
