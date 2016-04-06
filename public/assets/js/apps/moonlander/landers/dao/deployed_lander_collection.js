define(["app",
		"/assets/js/apps/moonlander/landers/dao/deployed_lander_model.js"], 
function(Moonlander, deployedLanderModel) {
  
  var deployedLanderCollection = Backbone.Collection.extend({
    model: deployedLanderModel,
  });


  return deployedLanderCollection;
});
