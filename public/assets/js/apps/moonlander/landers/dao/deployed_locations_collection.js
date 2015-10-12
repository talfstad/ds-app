define(["app",
		"/assets/js/apps/moonlander/landers/dao/deployed_locations_model.js"], 
function(Moonlander, DeployedLocationsModel) {
  
  var DeployedLocationsCollection = Backbone.Collection.extend({
    model: DeployedLocationsModel,
  });


  return DeployedLocationsCollection;
});
