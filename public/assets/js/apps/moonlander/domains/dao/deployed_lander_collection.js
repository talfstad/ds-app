define(["app",
		"/assets/js/apps/moonlander/domains/dao/deployed_lander_model.js"], 
function(Moonlander, DeployedLanderModel) {
  
  var DeployedLanderCollection = Backbone.Collection.extend({
    model: DeployedLanderModel,
  });


  return DeployedLanderCollection;
});
