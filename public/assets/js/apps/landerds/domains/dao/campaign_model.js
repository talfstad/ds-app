define(["app"], 
function(Landerds){
  var CampaignModel = Backbone.Model.extend({
  	urlRoot: '/api/campaigns',
    defaults: {
    }
  });

  return CampaignModel;

});