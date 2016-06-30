define(["app",
		"assets/js/apps/landerds/landers/dao/deployed_domain_model"], 
function(Landerds, deployedDomainModel) {
  
  var deployedDomainCollection = Backbone.Collection.extend({
    model: deployedDomainModel,
  });


  return deployedDomainCollection;
});
