define(["app",
		"assets/js/apps/moonlander/landers/dao/deployed_domain_model"], 
function(Moonlander, deployedDomainModel) {
  
  var deployedDomainCollection = Backbone.Collection.extend({
    model: deployedDomainModel,
  });


  return deployedDomainCollection;
});
