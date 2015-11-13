define(["app"], 
function(Moonlander){
  var CampaignModel = Backbone.Model.extend({
  	urlRoot: '/api/campaigns',
    defaults: {
      
    }
  });

  return CampaignModel;

});