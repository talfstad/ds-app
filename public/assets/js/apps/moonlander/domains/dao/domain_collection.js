define(["app",
		"/assets/js/apps/moonlander/domains/dao/domain_model.js"], 
function(Moonlander, DomainModel) {
  
  var DeployedLocationsCollection = Backbone.Collection.extend({
    model: DomainModel,
  });


  return DeployedLocationsCollection;
});
