define(["app",
		"/assets/js/apps/moonlander/campaigns/dao/deployed_domain_model.js"], 
function(Moonlander, DeployedDomainModel) {
  
  var DeployedDomainCollection = Backbone.Collection.extend({
    model: DeployedDomainModel,
  });


  return DeployedDomainCollection;
});
