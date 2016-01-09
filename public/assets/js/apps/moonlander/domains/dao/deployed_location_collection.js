define(["app",
		"/assets/js/apps/moonlander/domains/dao/deployed_location_model.js"], 
function(Moonlander, DeployedLocationModel) {
  
  var DeployedLocationCollection = Backbone.Collection.extend({
    model: DeployedLocationModel,
  });


  return DeployedLocationCollection;
});
